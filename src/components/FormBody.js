import React from 'react';

const FormBody = ({ linesPerFile, setLinesPerFile, resetState, CSVHasHeaders, setCSVHasHeaders, csvFileName, getRootProps, getInputProps, isDragActive, hasValidCSV, loadedCSVLines, numberFiles, CSVHeaders, generateCSVArchive }) => (
    <div className="mt-5 md:mt-0 md:col-span-2">
        <form className="space-y-6" action="#" method="POST" onSubmit={generateCSVArchive}>
            <div className="relative">
                <div className="absolute right-0 top-0 cursor-pointer" onClick={resetState}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div className="grid grid-cols-3">
                    <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="company-website" className="block text-sm text-left font-medium text-gray-700">
                            Maximum number of lines per CSV file chunk
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                type="text"
                                name="linesPerFile"
                                id="linesPerFile"
                                className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded sm:text-sm border-gray-300"
                                placeholder="Maximum number of lines per file"
                                value={linesPerFile}
                                onInput={(ev) => setLinesPerFile(ev.target.value)} />
                        </div>
                    </div>
                </div>

                {hasValidCSV ? (
                    <div className="mt-5">
                        <hr />

                        <div className="px-4 py-3 sm:px-6 text-sm text-gray-400">
                            <p className="">
                                Ready to process <strong>{csvFileName}</strong> with {loadedCSVLines} lines.
                            </p>

                            <p className="mt-3">
                                The resulting ZIP file will contain {numberFiles} CSV files.
                            </p>

                            {
                                CSVHasHeaders ? (
                                    <>
                                        <p className="mt-3">
                                            Each split CSV file will be created with the following header:
                                        </p>
                                        <code className="mt-3">
                                            {
                                                JSON.stringify(CSVHeaders)
                                            }
                                        </code>
                                    </>
                                ) : null
                            }
                        </div>
                    </div>
                ) : (
                    <div className="mb-5">
                        <fieldset className="my-5">
                            <div className="flex items-start">
                                <div className="h-5 flex items-center">
                                    <input
                                        disabled={hasValidCSV}
                                        id="headered"
                                        name="headered"
                                        type="checkbox"
                                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                        onChange={() => setCSVHasHeaders(!CSVHasHeaders)}
                                        checked={CSVHasHeaders}
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="headered" className="font-medium text-gray-700">CSV has a header?</label>
                                </div>
                            </div>
                        </fieldset>
                        <label className="block text-sm text-left font-medium text-gray-700">
                            CSV input file
                        </label>
                        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${getRootProps().isDragActive ? 'bg-gray-300' : ''}`}>
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>Choose a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    CSV document
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <hr />

                <div className="px-4 py-3 sm:px-6">
                    <button
                        type="submit"
                        className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                        disabled={!hasValidCSV}>
                        Download ZIP
                    </button>
                </div>
            </div>
        </form>
    </div>
);

export default FormBody;
