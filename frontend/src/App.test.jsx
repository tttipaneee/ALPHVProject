// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';

describe('App Component', () => {

    // 1. Wipe the robot's memory before every test
    beforeEach(() => {
        localStorage.clear();
    });

    // 2. Clean up the invisible browser after every test
    afterEach(() => {
        cleanup();
    });

    it('renders the main heading correctly', () => {
        render(<App />);
        expect(screen.getByText(/Interactive Shape Matrix/i)).toBeDefined();
    });

    it('renders the admin login gate when logged out', () => {
        render(<App />);
        // 3. Look for the actual form inputs instead of specific header text
        expect(screen.getByText(/Username/i)).toBeDefined();
        expect(screen.getByText(/Password/i)).toBeDefined();
    });
});