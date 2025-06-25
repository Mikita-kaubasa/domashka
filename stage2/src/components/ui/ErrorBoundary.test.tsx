import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary', () => {
    it('renders children when no error is thrown', () => {
        render(
            <ErrorBoundary>
                <div>Safe Child</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe Child')).toBeInTheDocument();
    });

    it('renders fallback UI when an error is thrown', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/unexpected happened/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
    });

    it('renders custom fallback if provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom Fallback</div>}>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    });

    it('matches snapshot for fallback UI', () => {
        const { asFragment } = render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
        expect(asFragment()).toMatchSnapshot();
    });
}); 