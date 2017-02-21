import './styles.css';

import createNodeEditor from '../node-editor';

export default React => {
  const [NodeEditor] = [createNodeEditor(React)];

  const Viewer = props => (
    <div className="viewer-container">
      <h1 id="project-name" contentEditable />
      <canvas id="viewer" />
      <NodeEditor />
    </div>
  );

  Viewer.propTypes = {
    children: React.PropTypes.node
  };

  return Viewer;
};
