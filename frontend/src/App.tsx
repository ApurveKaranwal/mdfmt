import { Route, Routes } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import AiGeneratorPage from './pages/AiGeneratorPage';
import TemplatesPage from './pages/TemplatesPage';
import BadgeStudioPage from './pages/BadgeStudioPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/ai-generator" element={<AiGeneratorPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/badge-studio" element={<BadgeStudioPage />} />
        </Routes>
    );
}

export default App;
