import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../utils/helpers.dart';

class CurrencyInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (newValue.text.isEmpty) {
      return newValue;
    }

    final digitsOnly = newValue.text.replaceAll(RegExp(r'[^\d]'), '');
    if (digitsOnly.isEmpty) {
      return newValue.copyWith(text: '');
    }

    final formatted = Helpers.formatCurrency(int.parse(digitsOnly));

    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class CurrencyInputField extends StatelessWidget {
  const CurrencyInputField({
    super.key,
    required this.labelText,
    this.initialValue = '',
    this.onChanged,
    this.prefixText,
    this.decoration,
    this.controller,
  });

  final String labelText;
  final String initialValue;
  final ValueChanged<String>? onChanged;
  final String? prefixText;
  final InputDecoration? decoration;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      initialValue: controller == null ? initialValue : null,
      keyboardType: TextInputType.number,
      inputFormatters: [CurrencyInputFormatter()],
      decoration:
          decoration ??
          InputDecoration(
            labelText: labelText,
            border: const OutlineInputBorder(),
            prefixText: prefixText,
          ),
      onChanged: onChanged,
    );
  }
}
