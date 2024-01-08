import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CodeExecution = () => {
  const { user } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [runtime, setRuntime] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cancelBtnVisible, setCancelBtnVisible] = useState(false);
  const [fetchController, setFetchController] = useState(null);

  const executeCode = async () => {
    if (!code || !runtime || isButtonDisabled) {
      return;
    }

    setExecutionStatus("Queued");
    setExecutionResult(null);
    setIsButtonDisabled(true);
    setCancelBtnVisible(true);


    const controller = new AbortController();
    setFetchController(controller);

    try {
      const response = await fetch("http://localhost:5000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          runtime,
        }),
        signal: controller.signal,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      setExecutionStatus(result.status);

      if (result.status === "Execution Complete") {
        setExecutionResult(result.result);
        if (!result.result) {
         
          toast.error("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setExecutionStatus("Something is Wrong,Try Again!");
      toast.error("Something went wrong. Please try again.");
    } finally {
      
      const cooldownDuration = 5;
      setCountdown(cooldownDuration);

      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setIsButtonDisabled(false);
            return null;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        setIsButtonDisabled(false);
        setCountdown(null);
      }, cooldownDuration * 1000);
    }
  };
  useEffect(() => {
    if (countdown === null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-16 text-white text-center">
        --- Code Execution ---
      </h1>
      <hr className="my-4 max-w-2xl mx-auto" />
      {user ? (
        <div className="space-y-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here"
            rows="10"
            className="w-full p-2 border bg-slate-900 text-white rounded focus:outline-none border-blue-900 focus:border-blue-500"
          ></textarea>
          <select
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none bg-slate-900 text-white border-blue-800 focus:border-blue-500"
          >
            <option value="">Select Runtime</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
            <option value="c++">C++</option>
            <option value="php">PHP</option>
          </select>
          <div className="flex gap-4">
            <button
              onClick={executeCode}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
            >
              Execute Code
            </button>
            {countdown !== null && (
              <div className="text-gray-500 text-sm mt-2 flex gap-2 items-center justify-center">
                <div>
                  <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                </div>{" "}
                Cooldown: {countdown}
              </div>
            )}
          </div>
          <div className="text-white">
            <strong>Status:</strong> {executionStatus}
          </div>
          {executionResult && (
            <div className="text-white">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Result:
              </label>
              <textarea
                id="message"
                rows="10"
                disabled
                placeholder={executionResult}
                className="block p-2.5 w-full text-sm text-gray-900  border focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  border-green-500 rounded-xl bg-slate-900"
              ></textarea>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-white border-2 max-w-xl mx-auto border-blue-600">
          Please log in to execute code.
        </p>
      )}
    </div>
  );
};

export default CodeExecution;
