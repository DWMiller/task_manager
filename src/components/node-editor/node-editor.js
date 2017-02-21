import './styles.css';

export default React => {
  const NodeEditor = props => (
    <div id="node-editor" className="node-editor">
      <header>
        <h2>
          Node Editor
          <button id="editor-hide" className="button raised red">
            Hide
          </button>
        </h2>
      </header>
      <section id="node-data">
        <form>
          <fieldset>
            <div className="input-group">
              <input type="text" id="node-label" value="" />
            </div>
            <div className="input-group quill-wrapper">
              <div id="node-description--toolbar" className="toolbar">
                <div className="ql-format-group">
                  <select title="Font" className="ql-font">
                    <option value="sans-serif" selected="">
                      Sans Serif
                    </option>
                    <option value="serif">Serif</option>
                    <option value="monospace">
                      Monospace
                    </option>
                  </select>
                  <select title="Size" className="ql-size">
                    <option value="10px">Small</option>
                    <option value="13px" selected="">
                      Normal
                    </option>
                    <option value="18px">Large</option>
                    <option value="32px">Huge</option>
                  </select>
                </div>
                <span className="ql-format-group">
                  <span title="Bold" className="ql-format-button ql-bold" />
                  <span className="ql-format-separator" />
                  <span title="Italic" className="ql-format-button ql-italic" />
                  <span className="ql-format-separator" />
                  <span
                    title="Underline"
                    className="ql-format-button ql-underline"
                  />
                  <span className="ql-format-separator" />
                  <span
                    title="Strikethrough"
                    className="ql-format-button ql-strike"
                  />
                </span>
                <div className="ql-format-group">
                  <span title="List" className="ql-format-button ql-list" />
                  <span className="ql-format-separator" />
                  <span title="Bullet" className="ql-format-button ql-bullet" />
                  <span className="ql-format-separator" />
                  <select title="Text Alignment" className="ql-align">
                    <option value="left" label="Left" selected="" />
                    <option value="center" label="Center" />
                    <option value="right" label="Right" />
                    <option value="justify" label="Justify" />
                  </select>
                </div>
                <div className="ql-format-group">
                  <span title="Link" className="ql-format-button ql-link" />
                </div>
              </div>

              <div id="node-description--editor" className="editor">
                <div>Hello World!</div>
              </div>

            </div>
            <div className="input-group">
              <label for="node-type">Type</label>
              <select name="" id="node-type">
                <option>Select Type</option>
                <option value="grouping">Grouping</option>
                <option value="content">Content</option>
              </select>
            </div>
            <div className="input-group">
              <label for="node-status">Status</label>
              <select name="" id="node-status">
                <option>Select Status</option>
                <option value="complete">complete</option>
                <option value="incomplete">incomplete</option>
              </select>
            </div>
            <div className="input-group">
              <label for="node-importance">Importance</label>
              <input id="node-importance" type="number" min="1" max="10" />
            </div>
          </fieldset>
        </form>
      </section>
      <section id="node-commands">
        <button id="node-createChild" className="button raised blue">
          Create
          Child Node
        </button>
        <button id="node-delete" className="button raised red">
          Delete Node
        </button>
        <button id="node-move" className="button raised green">
          Change
          Parent
        </button>
      </section>
    </div>
  );

  NodeEditor.propTypes = {
    children: React.PropTypes.node
  };

  return NodeEditor;
};
