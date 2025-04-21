import { JSX } from "react";

export interface FormQuestion {
	id: string;                   // Unique identifier (e.g., "q1")
	type: 'text' | 'dropdown' | 'table' | 'file';
	pos: number;                // Position in the form (e.g., 1, 2, 3)
	col?: number;                // Column number (e.g., 1, 2, 3)
	question: string;             // Label (e.g., "What's your name?")
	required: boolean;            // Mandatory field validation
	placeholder?: string;         // Hint text (optional)
	defaultValue?: string;        // Pre-filled value (optional)
	conditions?: Condition[];     // Conditional logic (shown below)

	// Field-specific properties (union type)
	config: TextConfig | DropdownConfig | TableConfig | FileConfig;
}

export interface TextConfig {
	minLength?: number;  // Minimum characters
	maxLength?: number;  // Maximum characters
	regex?: string;      // Validation pattern (e.g., email regex)
}

export interface DropdownConfig {
	options: string[];             // Available choices (e.g., ["Yes", "No"])
	isMulti?: boolean;             // Allow multiple selections
	defaultSelected?: string[];    // Pre-selected options
}

export interface TableConfig {
	columns: {
	  id: string;
	  label: string;       // Column header (e.g., "Product")
	  type: 'text' | 'dropdown';
	  options?: string[];  // For dropdown columns
	  required?: boolean;  // Mandatory cells
	}[];
	rows: {
	  id: string;
	  label: string;       // Row header (e.g., "Product 1")
	  cells: {
		columnId: string;  // References a column ID
		defaultValue?: string; // Pre-filled value (optional)
	  }[];
	}[];
  }

export interface FileConfig {
	allowedTypes: string[];  // e.g., ["image/png", "application/pdf"]
	maxSizeMB: number;       // Maximum file size (e.g., 5)
	multiple?: boolean;      // Allow multiple files
}

export interface Condition {
	targetOption: string;    // The value that triggers this condition
	action: 'SHOW' | 'HIDE' | 'JUMP' | 'ENABLE';
	targetElement: string;   // ID of the question to affect
	operator?: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS'; // For advanced logic
}

export interface SidebarElement {
	type: 'text' | 'dropdown' | 'table' | 'file'; // Type of form element
	label: string;           // Display name (e.g., "Text Input")
	icon?: JSX.Element;       // Icon representation (e.g., <IconText />
}

export interface FormLayout {
	id: string;
	title: string;
	elements: FormQuestion[];  
  }


