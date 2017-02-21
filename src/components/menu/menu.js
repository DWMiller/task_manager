import './styles.css';

export default React => {
  const Menu = props => (
    <div id="menu" className="menu">
      <header>
        <h2>Menu</h2>
      </header>
      <section>
        <header>
          <h3>Manage Projects</h3>
        </header>
        <form id="menu-load">
          <select name="existing-projects" size="4" id="existing-projects" />
          <button id="project-open" className="button raised blue">
            Load Project
          </button>
        </form>
        <button id="project-create" className="button raised blue">
          Create New
          Project
        </button>
        <button id="project-export" className="button raised blue">
          Export
          Project
        </button>
        <br />
        <input type="file" id="project-import" />
        <button id="project-import" className="button raised blue">
          {' '}Import Project
        </button>
      </section>

      <section>
        <header>
          <h2>Project Settings</h2>
        </header>

        <form id="menu-project">
          <fieldset>
            <legend>Manage Node Status</legend>
            <div className="input-group">
              <label for="" />
              <select name="" id="">
                <option>Select Status</option>
                <option value="complete">complete</option>
                <option value="incomplete">incomplete</option>
              </select>
              <button>Add</button>
              <button>Remove</button>
            </div>
          </fieldset>
          <fieldset>
            <div className="input-group">
              <label for="">Name</label>
              <input id="" type="text" value="" />
            </div>

            <div className="input-group">
              <label for="">Colour</label>
              <input id="colour-picker" className="color" />
            </div>

          </fieldset>
        </form>
      </section>

    </div>
  );

  Menu.propTypes = {
    children: React.PropTypes.node
  };

  return Menu;
};
