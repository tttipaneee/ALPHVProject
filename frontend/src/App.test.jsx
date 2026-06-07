// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Auth from './components/Auth';

describe('ShapeStream Application Tests', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders the main welcome page heading correctly', () => {
        render(<App />);
        expect(screen.getByText(/ShapeStream/i)).toBeDefined();
    });

    it('renders the login fields on the Auth component', () => {
        // Render Auth component inside MemoryRouter to provide routing context
        render(
            <MemoryRouter initialEntries={['/auth?role=admin']}>
                <Auth />
            </MemoryRouter>
        );
        expect(screen.getByText(/Username/i)).toBeDefined();
        expect(screen.getByText(/Password/i)).toBeDefined();
    });
});