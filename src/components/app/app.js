import './app.css';

import createMenu from '../menu';

export default React => {
  const [Menu] = [createMenu(React)];

  const App = props => (
    <div className="app">
      {props.children}
      <Menu />
    </div>
  );

  App.propTypes = {
    children: React.PropTypes.node.isRequired
  };

  return App;
};
