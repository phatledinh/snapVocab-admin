import { useState } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { ContentStudioPage } from './features/content-studio/ContentStudioPage';

export function App() {
  const [currentWordTitle, setCurrentWordTitle] = useState<string>('apple');

  return (
    <AdminLayout currentWordTitle={currentWordTitle}>
      <ContentStudioPage onWordChange={setCurrentWordTitle} />
    </AdminLayout>
  );
}

export default App;
