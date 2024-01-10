import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import MonacoEditor from "react-monaco-editor";
import useTitle from "../../hooks/useTitle";

const PreviousExecutions = () => {
  const { user } = useContext(AuthContext);
  const [previousExecutions, setPreviousExecutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionsPerPage] = useState(5);

  useTitle("Previous Executions");

  useEffect(() => {
    const fetchPreviousExecutions = async () => {
      try {
        const response = await fetch(
          `https://runmequick-server.vercel.app/api/execute?userEmail=${user.email}`,
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
  }, [user.email]);

  const indexOfLastExecution = currentPage * executionsPerPage;
  const indexOfFirstExecution = indexOfLastExecution - executionsPerPage;
  const currentExecutions = previousExecutions
    .slice()
    .reverse()
    .slice(indexOfFirstExecution, indexOfLastExecution);

    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(previousExecutions.length / executionsPerPage);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return (
      <ul className="flex items-center">
        {pageNumbers.map((number, index) => (
          <li key={index}>
            {number === "..." ? (
              <span className="px-3 py-2 mx-1 text-gray-500">...</span>
            ) : (
              <button
                className={`px-3 py-2 mx-1 rounded-full bg-teal-800 text-white ${
                  number === currentPage ? "bg-teal-600" : ""
                }`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="py-20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center mt-4">
        Previous Executions
      </h2>
      <hr />

      {currentExecutions.length > 0 ? (
        <div className="list-disc list-inside max-w-3xl mx-auto">
          {currentExecutions.map((execution, index) => (
            <ol
              key={index}
              className="text-white border p-4 rounded-md my-4 bg-slate-900 border-gray-800" 
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500 py-2 text-end">Sl No.{index + 1}</p>
                <p className="text-sm text-gray-300 py-2 font-bold">
                  <strong>Runtime:</strong>{" "}
                  <span className="text-blue-400">{execution.runtime}</span>
                </p>
                <MonacoEditor
                  width="100%"
                  height="300"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  className="rounded-md border t"
                  value={execution.code}
                  options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: true,
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
                  <p className="text-sm text-gray-500 mt-3">
                    <strong>Result:</strong>{" "}
                    <code
                      value={execution.result}
                      className="w-full text-green-400 font-mono bg-black  border rounded"
                    >
                      {execution.result}
                    </code>
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Timestamp:</strong>{" "}
                    <span className="font-bold text-gray-400">
                      {(execution.createdAt)}
                    </span>
                  </p>
                </div>
              </div>
            </ol>
          ))}
        </div>
      ) : (
        <p className="text-white">No previous executions found.</p>
      )}

      {previousExecutions.length > executionsPerPage && (
        <div className="flex justify-center mt-8">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default PreviousExecutions;
