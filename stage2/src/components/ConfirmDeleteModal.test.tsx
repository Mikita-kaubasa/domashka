import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
    const userName = 'Alice';

    it('renders when open is true', () => {
        render(
            <ConfirmDeleteModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} userName={userName} />
        );
        expect(screen.getByText('Delete user?')).toBeInTheDocument();
        expect(
            screen.getByText((content, node) =>
                node?.textContent === `Are you sure you want to delete ${userName}?`
            )
        ).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
        render(
            <ConfirmDeleteModal open={false} onCancel={jest.fn()} onConfirm={jest.fn()} userName={userName} />
        );
        expect(screen.queryByText('Delete user?')).not.toBeInTheDocument();
    });

    it('calls onCancel when Cancel button is clicked', () => {
        const handleCancel = jest.fn();
        render(
            <ConfirmDeleteModal open={true} onCancel={handleCancel} onConfirm={jest.fn()} userName={userName} />
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(handleCancel).toHaveBeenCalled();
    });

    it('calls onConfirm when Delete button is clicked', () => {
        const handleConfirm = jest.fn();
        render(
            <ConfirmDeleteModal open={true} onCancel={jest.fn()} onConfirm={handleConfirm} userName={userName} />
        );
        fireEvent.click(screen.getByText('Delete'));
        expect(handleConfirm).toHaveBeenCalled();
    });

    it('calls onCancel when Escape key is pressed', () => {
        const handleCancel = jest.fn();
        render(
            <ConfirmDeleteModal open={true} onCancel={handleCancel} onConfirm={jest.fn()} userName={userName} />
        );
        const modal = screen.getByText('Delete user?').closest('.modal-backdrop');
        if (modal) {
            fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
            expect(handleCancel).toHaveBeenCalled();
        }
    });

    it('calls onConfirm when Enter or Space key is pressed', () => {
        const handleConfirm = jest.fn();
        render(
            <ConfirmDeleteModal open={true} onCancel={jest.fn()} onConfirm={handleConfirm} userName={userName} />
        );
        const modal = screen.getByText('Delete user?').closest('.modal-backdrop');
        if (modal) {
            fireEvent.keyDown(modal, { key: 'Enter', code: 'Enter' });
            fireEvent.keyDown(modal, { key: ' ', code: 'Space' });
            expect(handleConfirm).toHaveBeenCalledTimes(2);
        }
    });

    it('has correct accessibility attributes', () => {
        render(
            <ConfirmDeleteModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} userName={userName} />
        );
        const modal = screen.getByText('Delete user?').closest('.modal-backdrop');
        expect(modal).toHaveAttribute('tabindex', '-1');
        const cancelBtn = screen.getByText('Cancel');
        const deleteBtn = screen.getByText('Delete');
        expect(document.activeElement).toBe(cancelBtn);
        expect(deleteBtn).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
            <ConfirmDeleteModal open={true} onCancel={jest.fn()} onConfirm={jest.fn()} userName={userName} />
        );
        expect(asFragment()).toMatchSnapshot();
    });
}); 