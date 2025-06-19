import "../form-builder.css";

function LeftPanel() {
  return (
    <nav className="left-panel">
      <div className="section-content">
        <h4>SECTIONS</h4>
        <div className="section-divider"></div>
      </div>

      <div className="endings-content">
        <h4>ENDINGS</h4>
        <div className="section-divider"></div>
      </div>
      <div className="username-footer">UserName</div>
    </nav>
  );
}

export default LeftPanel;
