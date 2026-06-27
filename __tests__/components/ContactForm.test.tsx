import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactForm } from '@/components/ContactForm';

// Mock the CSS module
vi.mock('@/components/ContactForm.module.css', () => ({
  default: {
    container: 'container',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    button: 'button',
    buttonActive: 'buttonActive',
    status: 'status',
    success: 'success',
    error: 'error',
  },
}));

describe('ContactForm Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it('renders all form fields correctly', () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Contact (Email or Phone)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows success message after successful submission', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Your Contact (Email or Phone)'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello!' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("Message sent successfully! I'll get back to you soon.")).toBeInTheDocument();
    });
  });

  it('shows error message when API fails', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Too many requests' }),
    });

    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Your Contact (Email or Phone)'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello!' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Too many requests')).toBeInTheDocument();
    });
  });
});
