import React from 'react';

const FormHeader = ({ reset }) => (
    <div className="md:col-span-1">
        <h3 className="text-lg mb-2 font-medium leading-6 text-gray-900">Split a CSV file</h3>

        <hr />

        <p className="mt-2 text-sm text-gray-500">
            This form will allow to you submit a single CSV file and split it into N CSV file chunks of your specified line limit, then retrieve them in a ZIP archive.
        </p>
        <p className="mt-2 mb-2 text-sm text-gray-500">
            If headers are enabled, each chunk will preserve the original CSV's header.
        </p>

        <hr />

        <p className="mt-2 font-bold text-sm text-gray-500">
            All parsing, splitting, and compression is done locally in the browser; your processed files will NOT be transferred.
        </p>
    </div>
);

export default FormHeader;