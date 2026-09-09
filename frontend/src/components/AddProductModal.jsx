/**
 * @fileoverview AddProductModal Component - Product Creation Interface
 *
 * This is a modal component of the DEX Product Store application,
 * serving as the product creation interface. It provides a focused,
 * non-disruptive way to collect product data through a form-based
 * modal interface with validation and loading states.
 *
 * Component Responsibilities:
 * - Display modal interface for product creation
 * - Provide form inputs for product data collection
 * - Handle form validation and submission
 * - Integrate with global state management
 * - Manage modal open/close functionality
 *
 * Modal Architecture:
 * - Dialog: HTML5 dialog element with DaisyUI styling
 * - Header: Title and close button
 * - Form: Product data collection with validation
 * - Actions: Submit and cancel buttons
 * - Backdrop: Click-to-close functionality
 *
 * Form Features:
 * - Controlled inputs with global state binding
 * - Real-time validation with disabled states
 * - Loading indicators during submission
 * - Icon-enhanced input fields for better UX
 * - Form reset after successful submission
 *
 * State Management Integration:
 * - Uses useProductStore for form data and CRUD operations
 * - Integrates with addProduct workflow
 * - Manages loading states and form validation
 * - Handles modal close after successful submission
 *
 * Why modal approach: Modals provide a focused, non-disruptive way to
 * collect form data without navigating away from the main product list.
 * This maintains context and provides better user experience.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 */

/**
 * Lucide React icons for UI elements and visual indicators.
 *
 * Lucide React provides a comprehensive set of beautiful, customizable
 * SVG icons that are optimized for React applications. These icons
 * enhance the user interface with clear visual indicators.
 *
 * Icons Used:
 * - DollarSignIcon: Price input field icon
 * - ImageIcon: Image URL input field icon
 * - Package2Icon: Product name input field icon
 * - PlusCircleIcon: Add product button icon
 *
 * Why Lucide React:
 * - Consistent design language across all icons
 * - Lightweight and tree-shakeable
 * - Excellent TypeScript support
 * - Customizable size, color, and styling
 *
 * @see {@link https://lucide.dev/} Lucide Icons Documentation
 */
import {
  DollarSignIcon,
  ImageIcon,
  Package2Icon,
  PlusCircleIcon,
} from 'lucide-react';

/**
 * Product store hook for global state management.
 *
 * useProductStore provides access to the global product state including:
 * - addProduct: Function to create new products via API
 * - formData: Form state for product data collection
 * - setFormData: Function to update form state
 * - loading: Boolean indicating if async operations are in progress
 *
 * Why global state: Form data needs to be shared between components
 * and persisted during the product creation workflow. Global state
 * ensures data consistency and eliminates prop drilling.
 *
 * @see {@link ../store/useProductStore} Product store implementation
 */
import { useProductStore } from '../store/useProductStore';

/**
 * AddProductModal component - Product creation interface.
 *
 * This component provides a modal interface for creating new products
 * with form-based data collection, validation, and integration with
 * the global product management system.
 *
 * Component Structure:
 * - Dialog: HTML5 dialog element with DaisyUI styling
 * - Header: Title and close button
 * - Form: Product data collection with validation
 * - Actions: Submit and cancel buttons
 * - Backdrop: Click-to-close functionality
 *
 * Form Features:
 * - Controlled inputs with global state binding
 * - Real-time validation with disabled states
 * - Loading indicators during submission
 * - Icon-enhanced input fields for better UX
 * - Form reset after successful submission
 *
 * State Management:
 * - Uses useProductStore for form data and CRUD operations
 * - Integrates with addProduct workflow
 * - Manages loading states and form validation
 * - Handles modal close after successful submission
 *
 * User Experience:
 * - Focused, non-disruptive data collection
 * - Real-time form validation feedback
 * - Loading states during async operations
 * - Clear visual hierarchy with icons
 * - Intuitive modal close mechanisms
 *
 * @returns {JSX.Element} The product creation modal interface
 */
function AddProductModal() {
  /**
   * Global product state from Zustand store.
   *
   * This destructuring extracts the necessary state and actions from
   * the global product store. The AddProductModal component needs
   * access to the form data, form management functions, and CRUD
   * operations to handle product creation.
   *
   * State Properties:
   * - addProduct: Function to create new products via API
   * - formData: Form state for product data collection
   * - setFormData: Function to update form state
   * - loading: Boolean indicating if async operations are in progress
   *
   * Why destructure here: Only the needed properties are extracted
   * to keep the component focused and avoid unnecessary re-renders
   * when unrelated state changes.
   */
  const { addProduct, formData, setFormData, loading } = useProductStore();

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box bg-base-100 text-base-content opacity-100 max-h-[90vh] overflow-y-auto">
        {/*
          Close Button
          =============
          
          This button provides a way to close the modal without
          submitting the form. It's positioned in the top-right
          corner for easy access and uses DaisyUI styling.
          
          Button Features:
          - Small, circular button with ghost styling
          - Positioned absolutely in top-right corner
          - Uses form method="dialog" for native modal close
          - X icon for clear close indication
          
          Why form method="dialog": This uses the native HTML5
          dialog close mechanism, which is more accessible and
          provides better keyboard navigation support.
        */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            X
          </button>
        </form>

        {/*
          Modal Header
          =============
          
          This section displays the modal title and provides
          clear context about the modal's purpose.
          
          Header Features:
          - Bold, large text for clear hierarchy
          - Descriptive title explaining the action
          - Adequate spacing for visual separation
          
          Why this title: "Add New Product" clearly communicates
          the modal's purpose and the action the user is performing.
        */}
        <h3 className="font-bold text-xl mb-4">Add New Product</h3>

        {/*
          Product Creation Form
          ======================
          
          This form handles the collection of product data and
          submission to the API. It includes all necessary
          input fields with validation and proper form handling.
          
          Form Features:
          - Controlled inputs with global state binding
          - Real-time validation with disabled states
          - Loading indicators during submission
          - Icon-enhanced input fields for better UX
          - Form reset after successful submission
          
          Why controlled inputs: Controlled inputs ensure the
          form state is always in sync with the component state
          and provide predictable behavior for form handling.
        */}
        <form onSubmit={addProduct} className="space-y-4">
          <div className="grid gap-4">
            {/*
              Product Name Input
              ===================
              
              This input field collects the product name with
              proper validation and visual enhancements.
              
              Input Features:
              - Text input with placeholder guidance
              - Package icon for visual context
              - Controlled input with state binding
              - Focus states with color transitions
              - Full width for optimal usability
              
              Why icon input: Icons provide visual context and
              make forms more intuitive. The package icon clearly
              indicates this field is for product information.
            */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Product Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Package2Icon className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/*
              Product Price Input
              ====================
              
              This input field collects the product price with
              number validation and proper formatting.
              
              Input Features:
              - Number input with decimal support
              - Dollar icon for visual context
              - Min value validation (prevents negative prices)
              - Step attribute for decimal precision
              - Controlled input with state binding
              
              Why number input: Price data should be numeric, and
              the number input type provides built-in validation
              and mobile keyboard optimization.
            */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <DollarSignIcon className="size-5" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            {/*
              Product Image URL Input
              ========================
              
              This input field collects the product image URL
              with proper validation and visual context.
              
              Input Features:
              - Text input for URL entry
              - Image icon for visual context
              - Placeholder with example format
              - Controlled input with state binding
              - Full width for optimal usability
              
              Why URL input: Image URLs are text-based and need
              to be entered manually. The placeholder provides
              guidance on the expected format.
            */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Image URL
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <ImageIcon className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/*
            Modal Action Buttons
            =====================
            
            This section contains the action buttons for the modal.
            It provides both cancel and submit actions with proper
            validation and loading states.
            
            Button Layout:
            - Cancel button (left): Closes modal without saving
            - Submit button (right): Creates product and closes modal
            
            Why this layout: The cancel button is positioned on the
            left to make it less prominent, while the submit button
            is on the right as the primary action. This follows
            common UI patterns and reduces accidental submissions.
          */}
          <div className="modal-action">
            {/*
              Cancel Button
              ==============
              
              This button closes the modal without saving changes.
              It uses the native dialog close mechanism for
              proper accessibility and keyboard navigation.
              
              Button Features:
              - Ghost styling to indicate secondary action
              - Uses form method="dialog" for native close
              - No form submission or data processing
              
              Why form method="dialog": This uses the native HTML5
              dialog close mechanism, which is more accessible and
              provides better keyboard navigation support.
            */}
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>

            {/*
              Submit Button
              ==============
              
              This button submits the form to create a new product.
              It's disabled when the form is invalid or loading
              to prevent invalid submissions.
              
              Button Features:
              - Primary styling to indicate main action
              - Disabled state when form is invalid or loading
              - Loading spinner during async operations
              - Plus icon for clear visual indication
              - Minimum width for consistent sizing
              
              Why disabled state: Form validation prevents
              invalid data from being submitted. The disabled
              state provides clear feedback about form validity
              and prevents unnecessary API calls.
            */}
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={
                !formData.name || !formData.price || !formData.image || loading
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/*
        Modal Backdrop
        ===============
        
        This backdrop provides click-to-close functionality
        for the modal. It covers the entire viewport and
        allows users to close the modal by clicking outside
        the modal content.
        
        Backdrop Features:
        - Covers entire viewport behind modal
        - Click-to-close functionality
        - Uses form method="dialog" for native close
        - Invisible button for accessibility
        - Proper z-index layering
        
        Why backdrop: Click-to-close is a common UX pattern
        that users expect from modals. It provides an
        intuitive way to dismiss the modal without using
        the close button.
      */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AddProductModal;
