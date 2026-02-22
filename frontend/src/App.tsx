import { Route, Routes } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    );
}

export default App;
