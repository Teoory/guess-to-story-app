import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './Hooks/UserContext';
import AppRoutes from './Routes/AppRoutes';

function App() {
  return (
    <Router>
      <UserContextProvider>
        <main className="app">
          <AppRoutes />
        </main>
      </UserContextProvider>
    </Router>
  );
}

export default App;
