import "./AppLoader.css";

export default function AppLoader() {
  return (
    <div className="app-loader">
      <div className="app-loader-content">
        <div className="app-loader-logo">
          <img src="/nexarag-logo.svg" alt="NexaRAG" />
        </div>

        <h1>NexaRAG</h1>

        <p>AI-powered document intelligence</p>

        <div className="app-loader-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="app-loader-status">Initializing your workspace</div>
      </div>
    </div>
  );
}
