import React, { useState, useRef } from 'react';
import { Button, TextField, Text } from 'monday-ui-react-core';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { useContext } from './store/context';

interface Variable {
  key: string;
  value: string;
}

interface DocumentContent {
  html: string;
  images: { [key: string]: ArrayBuffer };
  originalArrayBuffer: ArrayBuffer;
}

const DocumentProcessor = () => {
  const context = useContext();

  const [file, setFile] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<DocumentContent | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);
    setProcessedContent('');
    setVariables([]);

    try {
      if (!selectedFile.name.endsWith('.docx')) {
        throw new Error('Please upload a Word document (.docx)');
      }

      const arrayBuffer = await selectedFile.arrayBuffer();
      const content = await extractDocxContent(arrayBuffer);
      setDocumentContent({
        ...content,
        originalArrayBuffer: arrayBuffer,
      });

      // Extract variables from HTML content
      const variableMatches = content.html.match(/\{\{([^}]+)\}\}/g) || [];
      console.log('🚀', variableMatches);
      const uniqueVariables = [
        ...new Set(
          variableMatches.map((v) => v.slice(2, -2)), // Remove {{ and }}
        ),
      ];
      // Map variables to context values
      const mappedVariables = uniqueVariables.map((key) => {
        let value: any = '';
        // Map known context variables
        if (key === 'board.name') {
          value = context.boardData.name;
        } else if (key === 'board.description') {
          value = context.boardData.description;
        } else if (key === 'item.table.body') {
          value = context.itemData;
        }
        return { key, value };
      });
      console.log('🚀🚀', mappedVariables);
      setVariables(mappedVariables);
      // setVariables(uniqueVariables.map((key) => ({ key, value: '' })));

      if (uniqueVariables.length === 0) {
        setError(
          'No variables found in the document. Variables should be in the format {{variableName}}',
        );
      }
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Error processing file');
      setFile(null);
      setDocumentContent(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract content from .docx file
  const extractDocxContent = async (
    arrayBuffer: ArrayBuffer,
  ): Promise<DocumentContent> => {
    const mammoth = await import('mammoth');

    // Convert to HTML while preserving styles and images
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        convertImage: mammoth.images.imgElement((image) => {
          return image.read().then((imageBuffer) => {
            const imageKey = `image-${Math.random().toString(36).substr(2, 9)}`;
            return {
              src: imageKey,
              class: 'document-image',
              imageBuffer,
            };
          });
        }),
        //preserveStyles: true,
      },
    );

    // Extract images from the conversion result
    const images: { [key: string]: ArrayBuffer } = {};
    const processedHtml = result.value.replace(
      /<img[^>]+src="([^"]+)"[^>]*>/g,
      (match, src) => {
        if (src.startsWith('image-')) {
          const imgElement = new DOMParser()
            .parseFromString(match, 'text/html')
            .querySelector('img');
          if (imgElement && imgElement.hasAttribute('imageBuffer')) {
            const imageBuffer = imgElement.getAttribute('imageBuffer');
            images[src] = imageBuffer as unknown as ArrayBuffer;
          }
        }
        return match;
      },
    );

    return {
      html: processedHtml,
      images,
      originalArrayBuffer: arrayBuffer,
    };
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle variable value changes
  /*const handleVariableChange = async (key: string, value: string) => {
    setVariables((prev) => prev.map((v) => (v.key === key ? { ...v, value } : v)));

    // Update preview with current variable values
    if (documentContent) {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        await zip.loadAsync(documentContent.originalArrayBuffer);
        const documentXml = await zip.file('word/document.xml')?.async('text');

        if (documentXml) {
          let processedXml = documentXml;
          variables.forEach((v) => {
            const variableValue = v.key === key ? value : v.value;
            const escapedKey = v.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(
              `<w:t([^>]*)>([^<]*)?\\{\\{${escapedKey}\\}\\}([^<]*)?</w:t>`,
              'g',
            );
            processedXml = processedXml.replace(
              regex,
              (match, attributes, prefix = '', suffix = '') => {
                return `<w:t${attributes}>${prefix}${variableValue}${suffix}</w:t>`;
              },
            );
          });

          zip.file('word/document.xml', processedXml);
          const processedBuffer = await zip.generateAsync({ type: 'blob' });

          // Convert to HTML for preview only
          const mammoth = await import('mammoth');
          const processedArrayBuffer = await processedBuffer.arrayBuffer();
          const { value: processedHtml } = await mammoth.convertToHtml(
            { arrayBuffer: processedArrayBuffer },
            {
              convertImage: mammoth.images.imgElement((image) => {
                return image.read().then((imageBuffer) => ({
                  src: URL.createObjectURL(new Blob([imageBuffer])),
                  class: 'document-image',
                }));
              }),
            },
          );

          setProcessedContent(processedHtml);
        }
      } catch (error) {
        console.error('Error updating preview:', error);
      }
    }
  };*/

  // Trigger file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Process document with variable substitution
  const processDocument = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!file || !documentContent) {
        throw new Error('No document loaded');
      }

      // First, create a new HTML preview by re-converting the processed document
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Load the original document
      await zip.loadAsync(documentContent.originalArrayBuffer);
      //console.log('🧩', documentContent.originalArrayBuffer);

      // Get the main document content
      const documentXml = await zip.file('word/document.xml')?.async('text');
      if (!documentXml) {
        throw new Error('Could not read document content');
      }
      //console.log('🧩🧩', documentXml);

      // Replace variables in the document XML
      let processedXml = documentXml;
      variables.forEach(({ key, value }) => {
        // Escape special characters in the key (like dots)
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Split the key for multi-tag matching
        const [firstPart, secondPart] = key.split('.');

        // Two patterns: one for single tag, one for multi-tag
        const singleTagPattern = `<w:t[^>]*>\\{\\{${escapedKey}\\}\\}</w:t>`;
        const multiTagPattern =
          `<w:t[^>]*>\\{\\{</w:t></w:r><w:r>.*?` +
          `<w:t[^>]*>${firstPart}\\.` +
          `</w:t></w:r><w:r>.*?` +
          `<w:t[^>]*>${secondPart}\\}\\}</w:t>`;

        const regex = new RegExp(singleTagPattern + '|' + multiTagPattern, 'gs');

        // Log for debugging
        //console.log('Looking for:', key);
        //console.log('Pattern:', singleTagPattern + '|' + multiTagPattern);
        //console.log('XML contains match:', regex.test(processedXml));

        // Replace with value
        processedXml = processedXml.replace(regex, `<w:t>${value}</w:t>`);

        // Log after replacement
        console.log('Replacement made:', key, processedXml.includes(value));
      });

      // Update the document.xml in the zip
      zip.file('word/document.xml', processedXml);

      // Generate the new document
      const processedBuffer = await zip.generateAsync({ type: 'blob' });

      // Convert the processed document back to HTML for preview
      const mammoth = await import('mammoth');
      const processedArrayBuffer = await processedBuffer.arrayBuffer();
      const { value: processedHtml } = await mammoth.convertToHtml(
        { arrayBuffer: processedArrayBuffer },
        {
          convertImage: mammoth.images.imgElement((image) => {
            return image.read().then((imageBuffer) => ({
              src: URL.createObjectURL(new Blob([imageBuffer])),
              class: 'document-image',
            }));
          }),
        },
      );

      setProcessedContent(processedHtml);
      saveAs(processedBuffer, `processed_${file.name}`);
    } catch (error) {
      console.error('Error processing document:', error);
      setError(error instanceof Error ? error.message : 'Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Upload Word Document</h2>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx"
            className="hidden"
          />

          {/* Drag and drop zone */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } `}
            onClick={handleFileInputClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">Click or drag to replace file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14m-8 0l-8-8-8 8m8-8v28"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>Click to upload</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">Word documents only</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </div>

        {/* Replace Variables Section */}
        {variables.length > 0 && (
          <div className="mt-4 rounded-lg border border-layout-border-color p-4">
            <Text type={Text.types.h2} weight={Text.weights.MEDIUM} className="mb-4">
              Review Variables
            </Text>

            <div className="flex flex-col gap-3">
              {Object.entries(context.boardData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Text weight={Text.weights.MEDIUM} className="min-w-32">
                    {key}:
                  </Text>
                  <Text color={Text.colors.SECONDARY}>
                    {value || 'No value available'}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        {file && variables.length > 0 && (
          <div className="flex space-x-4">
            <Button
              onClick={processDocument}
              disabled={isProcessing || variables.length === 0}
            >
              Download Document
            </Button>
          </div>
        )}

        {/* Preview Section */}
        {processedContent && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Preview</h2>
            <div
              className="prose max-w-none rounded bg-gray-50 p-4"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessor;
