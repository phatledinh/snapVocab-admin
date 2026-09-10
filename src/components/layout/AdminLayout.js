import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export const AdminLayout = ({ children, currentWordTitle, }) => {
    const [activeNav, setActiveNav] = useState('content-studio');
    return (_jsxs("div", { className: "flex h-screen w-screen overflow-hidden bg-background font-sans", children: [_jsx(Sidebar, { activeNav: activeNav, onNavigate: setActiveNav }), _jsxs("div", { className: "flex-1 flex flex-col h-full min-w-0 overflow-hidden", children: [_jsx(Header, { currentWordTitle: currentWordTitle }), _jsx("main", { className: "flex-1 overflow-hidden relative", children: children })] })] }));
};
