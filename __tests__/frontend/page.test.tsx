import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CookingFormulationApp from '@/src/app/page';

// Mock next-auth `useSession` hook
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
    })
) as jest.Mock;

describe('CookingFormulationApp - Authentication', () => {
    beforeEach(() => {
        // Reset mocks before each test
        (global.fetch as jest.Mock).mockClear();
        jest.clearAllMocks();
    });

    // Test Case: Normal (Render Auth Page)
    test('should render the login form by default for unauthenticated users', () => {
        render(<CookingFormulationApp />);
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    // Test Case: Normal (Switch to Register)
    test('should switch to the registration form when "Register" is clicked', async () => {
        render(<CookingFormulationApp />);
        const registerButton = screen.getByRole('button', { name: /register/i });
        await userEvent.click(registerButton);
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/i am a.../i)).toBeInTheDocument();
    });

    // Test Case: Null (Empty form submission)
    test('should show HTML validation errors for empty registration form', async () => {
        render(<CookingFormulationApp />);
        const user = userEvent.setup();
        const registerSwitchButton = screen.getByRole('button', { name: /register/i });
        await userEvent.click(registerSwitchButton);

        const submitButton = screen.getByRole('button', { name: /register/i });
        await user.click(submitButton);

        // Check for validation message on a required field
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toBeInvalid();
    });

    // Test Case: Invalid (Short password)
    test('should show an error message from the server for invalid data', async () => {
        // Mock a failed fetch response
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ message: 'Password must be at least 8 characters.' }),
            })
        );
        render(<CookingFormulationApp />);
        const user = userEvent.setup();

        // Switch to register
        await user.click(screen.getByRole('button', { name: /register/i }));

        // Fill form with invalid data
        await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), '123');
        await user.click(screen.getByRole('button', { name: /register/i }));

        // Wait for the error message to appear
        expect(await screen.findByText(/Password must be at least 8 characters./i)).toBeInTheDocument();
    });
});

describe('CookingFormulationApp - Recipe Builder', () => {
    const mockIngredients = [
        { id: '1', name: 'Flour', caloriesPer100g: 364, isVegan: true, isVegetarian: true, sources: [{ pricePerKg: 1.50 }] },
        { id: '2', name: 'Sugar', caloriesPer100g: 400, isVegan: true, isVegetarian: true, sources: [{ pricePerKg: 2.00 }] },
    ];

    beforeEach(() => {
        // Mock session to be authenticated
        (jest.requireMock('next-auth/react').useSession as jest.Mock).mockReturnValue({
            data: { user: { email: 'test@test.com' } },
            status: 'authenticated',
        });

        // Mock fetch to return ingredients
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockIngredients),
            })
        );
    });

    // Test Case: Normal (Add ingredient and check totals)
    test('should add an ingredient to the recipe and update totals', async () => {
        render(<CookingFormulationApp />);
        const user = userEvent.setup();

        // Wait for ingredients to load and be displayed
        const addButton = await screen.findAllByRole('button', { name: /add/i });
        await user.click(addButton[0]); // Add Flour

        // Assert Flour is in the recipe list with default quantity
        const recipeSection = screen.getByRole('heading', { name: /current recipe/i }).parentElement as HTMLElement;
        expect(within(recipeSection).getByText('Flour')).toBeInTheDocument();
        expect(within(recipeSection).getByDisplayValue('100')).toBeInTheDocument();

        // Assert totals are calculated correctly (100g of Flour at £1.50/kg = £0.15)
        expect(screen.getByText(/\£0.15/i)).toBeInTheDocument();
        // Calories: (364 / 100) * 100 = 364
        expect(screen.getByText(/364 kcal/i)).toBeInTheDocument();
    });

    // Test Case: Boundary (Update quantity to 0)
    test('should update totals correctly when quantity is set to 0', async () => {
        render(<CookingFormulationApp />);
        const user = userEvent.setup();

        // Add Flour
        const addButton = await screen.findAllByRole('button', { name: /add/i });
        await user.click(addButton[0]);

        // Find the quantity input and change its value to 0
        const quantityInput = await screen.findByDisplayValue('100');
        await user.clear(quantityInput);
        await user.type(quantityInput, '0');

        // Assert totals are now 0
        expect(screen.getByText(/\£0.00/i)).toBeInTheDocument();
        expect(screen.getByText(/0 kcal/i)).toBeInTheDocument();
    });
});