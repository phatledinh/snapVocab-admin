import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { ContentStudioPage } from './features/content-studio/ContentStudioPage';
export function App() {
    const [currentWordTitle, setCurrentWordTitle] = useState('apple');
    return (_jsx(AdminLayout, { currentWordTitle: currentWordTitle, children: _jsx(ContentStudioPage, { onWordChange: setCurrentWordTitle }) }));
}
export default App;
