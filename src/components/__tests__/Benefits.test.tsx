import { render, screen } from '@testing-library/react';
import { Benefits } from '../Benefits';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, transition, className, ...props }: any) => 
      <div className={className} {...props}>{children}</div>,
  },
}));

describe('Benefits Component', () => {
  it('renders the section heading correctly', () => {
    render(<Benefits />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Why Morning Buddy?');
  });

  it('renders all four benefit items', () => {
    render(<Benefits />);
    
    // Check for all benefit titles
    expect(screen.getByText('No more startling alarms')).toBeInTheDocument();
    expect(screen.getByText('Personalised conversations')).toBeInTheDocument();
    expect(screen.getByText('Integrates with your calendar and weather')).toBeInTheDocument();
    expect(screen.getByText('Helps you build a consistent morning routine')).toBeInTheDocument();
  });

  it('renders benefit descriptions', () => {
    render(<Benefits />);
    
    expect(screen.getByText('Replace jarring sounds with gentle, personalized conversations')).toBeInTheDocument();
    expect(screen.getByText('Every call is tailored to your preferences and daily needs')).toBeInTheDocument();
    expect(screen.getByText('Get relevant updates and preparation for your day ahead')).toBeInTheDocument();
    expect(screen.getByText('Develop positive habits with your AI companion\'s support')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Benefits />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'benefits-heading');
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('renders icons with proper accessibility labels', () => {
    render(<Benefits />);
    
    const icons = screen.getAllByRole('img');
    expect(icons).toHaveLength(4);
    
    expect(screen.getByLabelText('No more startling alarms icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Personalised conversations icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Integrates with your calendar and weather icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Helps you build a consistent morning routine icon')).toBeInTheDocument();
  });

  it('has the correct section structure', () => {
    render(<Benefits />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('py-20', 'bg-gradient-to-br', 'from-amber-50', 'via-orange-50', 'to-yellow-50');
  });
});