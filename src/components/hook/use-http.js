import { useCallback } from "react";

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //requestConfig的对象包括url，method，headers，body配置
  const sendHttp = useCallback(async (requestConfig, apply) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      const data = await response.json();

      //传进来的函数接收response的data。apply是用于数据转换
      apply(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, []);

  //useHttp的hookes6语法isLoading:isLoading===isLoading
  //自定义hook需要return出去东西
  return { isLoading, error, sendHttp };
}
export default useHttp;
