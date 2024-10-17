import React from 'react';
import { render, screen } from '@testing-library/react';
import ComingSoon from '../ComingSoon';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('ComingSoon', () => {
  it('renders the title', () => {
    render(<ComingSoon title="Test Title" backTo="/" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the default message when no message is provided', () => {
    render(<ComingSoon title="Test Title" backTo="/" />);
    expect(screen.getByText('해당 페이지는 현재 준비 중입니다.')).toBeInTheDocument();
  });

  it('renders the provided message when one is given', () => {
    render(<ComingSoon title="Test Title" backTo="/" message="Custom message" />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });
});