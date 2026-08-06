import { Route, Routes } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import AiGeneratorPage from './pages/AiGeneratorPage';
import TemplatesPage from './pages/TemplatesPage';
import BadgeStudioPage from './pages/BadgeStudioPage';

import ProfileBuilderPage from './pages/ProfileBuilderPage';
import DiagramStudioPage from './pages/DiagramStudioPage';
import CliPage from './pages/CliPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/ai-generator" element={<AiGeneratorPage />} />
            <Route path="/cli" element={<CliPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/badge-studio" element={<BadgeStudioPage />} />
            <Route path="/diagrams" element={<DiagramStudioPage />} />
            <Route path="/profile" element={<ProfileBuilderPage />} />
        </Routes>
    );
}

export default App;
