# 🧱 Form Builder App

A drag-and-drop form builder built using **Next.js** and **Tailwind CSS**. It allows users to visually build custom forms with various input types, configure their properties, apply validation rules, and export or import form definitions in JSON format.

![Form Builder Screenshot](./screenshot.png)

## ✨ Features

- 🔧 Drag-and-drop form builder interface
- 🧩 Supports multiple field types:
  - Text Input
  - Email
  - Number
  - Textarea
  - Select Dropdown
  - Checkbox
  - Radio Button
  - Date Picker
  - Document Upload
- 🎯 Field customization:
  - Label
  - Placeholder
  - Required toggle
  - Validation rules (e.g. number-only, custom regex)
- 🔄 **JSON Import/Export**:
  - Export your entire form layout as a JSON file
  - Import a previously saved JSON to restore the form layout
- 👁️ **Preview Mode**:
  - Preview the fully rendered form to see its final appearance and layout
- ⚛️ Built with **Next.js**
- 🎨 Styled using **Tailwind CSS**

## 📥 JSON Import/Export

### Export Form Layout

Click the **Export** button to download the current form structure as a `.json` file. This file includes all fields, labels, placeholders, validation rules, and settings.

### Import Form Layout

Click the **Import** button and upload a previously exported `.json` file. The builder will automatically restore the form layout and configuration exactly as it was saved.

This feature is helpful for:
- Backing up forms
- Sharing form layouts with others
- Quickly loading pre-configured templates

## 👁️ Preview Mode

Use the **Preview** button to see how the final form will appear to end users. This mode renders all the added fields in their actual positions, providing a realistic view of the form before publishing or exporting.

## Code Mode

Use the **Code** button to generate json for present layout
