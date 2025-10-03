import { EmployeesProvider } from './context/EmployeesContext';
import EmployeeListPage from './pages/EmployeeListPage';

function App() {
  return (
    <EmployeesProvider>
      <EmployeeListPage />
    </EmployeesProvider>
  );
}

export default App;
