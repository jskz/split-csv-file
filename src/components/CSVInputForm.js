import React, { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import JSZip from 'jszip';

import FormHeader from './FormHeader';
import FormBody from './FormBody';

// let's not include the bulkiest grunt-y data in the React state tree
window.__CSV_DATA = [];

const CSVInputForm = () => {
    const [linesPerFile, setLinesPerFile] = useState(1000);
    const [hasValidCSV, setHasValidCSV] = useState(false);
    const [loadedCSVLines, setLoadedCSVLines] = useState(-1);
    const [csvFileName, setCSVFileName] = useState('input.csv');
    const [CSVHasHeaders, setCSVHasHeaders] = useState(true);
    const [CSVHeaders, setCSVHeaders] = useState([]);
    
    const numberFiles = useMemo(() => (parseInt(loadedCSVLines / linesPerFile) + (loadedCSVLines % linesPerFile > 0 ? 1 : 0)), [loadedCSVLines, linesPerFile]);
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            try {
                const reader = new FileReader();

                // something went wrong, fail validation
                reader.onabort = () => setHasValidCSV(false);
                reader.onerror = () => setHasValidCSV(false);

                reader.onload = () => {
                    // decode the file's Uint8Array as a UTF-8 string 
                    const stringified = new TextDecoder('utf-8').decode(reader.result);

                    // try to parse it using the header config specified in-form
                    const csvParseResult = Papa.parse(stringified, {
                        header: CSVHasHeaders,
                        dynamicTyping: true
                    });
                    
                    setLoadedCSVLines(csvParseResult.data.length);
                    setHasValidCSV(true);
                    setCSVFileName(file.name);

                    window.__CSV_DATA = [...csvParseResult.data];

                    if (CSVHasHeaders) {
                        setCSVHeaders(csvParseResult.meta.fields);
                    }
                }

                // kick off the FileReader
                reader.readAsArrayBuffer(file);
            } catch (err) {
                setHasValidCSV(false);
                console.log('Error.');
                console.error(err);
            }
        });
    }, [CSVHasHeaders]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    const generateCSVArchive = async (ev) => {
        ev.preventDefault();

        // pre-fill array of arrays for the CSVs we will generate 
        let files = [...new Array(numberFiles)].map(_ => ([]));

        for (let i = 0; i < window.__CSV_DATA.length; i++) {
            let fileIndex = ~~(i / linesPerFile);

            files[fileIndex].push(window.__CSV_DATA[i]);
        }

        const zipArchive = new JSZip();
        for (let f = 0; f < files.length; f++) {
            zipArchive.file(`${csvFileName}-chunk-${f + 1}.csv`, Papa.unparse(files[f]));
        }

        // this 'dirty effect' will asynchronously create a binary blob holding a
        // zip representation of the split CSV chunks; we'll insert into the DOM a
        // blob link to download it, trigger that download, and then remove the handle
        // used in the next event loop tick
        zipArchive.generateAsync({ type: 'blob' })
            .then(content => {
                const downloadLink = document.createElement('a');

                downloadLink.href = window.URL.createObjectURL(content);
                downloadLink.download = `split-${csvFileName}.zip`;
                downloadLink.click();

                document.body.appendChild(downloadLink);

                setTimeout(() => {
                    window.URL.revokeObjectURL(downloadLink.href);
                    document.body.removeChild(downloadLink);
                }, 0);
            });
        return false;
    };

    const resetState = () => {
        window.location.reload();
    };

    return (
        <div className="my-4 px-4 max-w-5xl mx-auto">
            <div className="bg-white shadow px-4 py-5 rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <FormHeader />
                    <FormBody
                        linesPerFile={linesPerFile}
                        setLinesPerFile={setLinesPerFile}

                        CSVHasHeaders={CSVHasHeaders}
                        setCSVHasHeaders={setCSVHasHeaders}
                        CSVHeaders={CSVHeaders}

                        loadedCSVLines={loadedCSVLines}
                        hasValidCSV={hasValidCSV}
                        numberFiles={numberFiles}
                        csvFileName={csvFileName}

                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}

                        resetState={resetState}

                        generateCSVArchive={generateCSVArchive}
                    />
                </div>
            </div>
        </div>
    );
};

export default CSVInputForm;