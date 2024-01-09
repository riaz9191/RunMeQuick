import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import MonacoEditor from "react-monaco-editor";

const PreviousExecutions = () => {
  const { user } = useContext(AuthContext);
  const [previousExecutions, setPreviousExecutions] = useState([]);

  useEffect(() => {
    // Fetch previous executions when the component mounts
    const fetchPreviousExecutions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/execute?userEmail=${user.email}`,
          {}
        );

        if (response.ok) {
          const { executions } = await response.json();
          setPreviousExecutions(executions);
        } else {
          console.error("Failed to fetch previous executions");
        }
      } catch (error) {
        console.error("Error fetching previous executions:", error);
      }
    };

    fetchPreviousExecutions();
  }, [[user.email]]); // Run once when the component mounts

  return (
    <div className="py-20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Previous Executions
      </h2>

      {previousExecutions.length > 0 ? (
        <ul className="list-disc list-inside max-w-xl mx-auto ">
          {previousExecutions.map((execution, index) => (
            <ol key={index} className="text-white border p-4 rounded-md my-4 bg-slate-900">
              <div className="mb-4">
                <p className="text-sm text-gray-500 py-2 text-end">Sl No.{index+1}</p>
                <p className="text-sm text-gray-500 py-2 font-bold">Code:</p>
                <MonacoEditor
                  width="100%"
                  height="300"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  className="rounded-md border"
                  value={execution.code}
                  options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: true, // Make the editor read-only
                    cursorStyle: "line",
                    automaticLayout: true,
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </div>
              <div className="flex justify-between items-center ">
                <div>
                  <p className="text-sm text-gray-500">
                    <strong>Timestamp:</strong>{" "}
                    <span className="font-bold text-gray-400">{(execution.createdAt)}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Runtime:</strong> <span className="text-blue-400">{execution.runtime}</span>
                  </p>

                  <p className="text-sm text-gray-500">
                    <strong>Result:</strong>{" "}
                    <code
                      value={execution.result}
                      className="text-green-400 font-mono "
                    >
                      {execution.result}
                    </code>
                  </p>
                </div>
              </div>
            </ol>
          ))}
        </ul>
      ) : (
        <p className="text-white">No previous executions found.</p>
      )}
    </div>
  );
};

export default PreviousExecutions;
