import 'package:flutter/material.dart';

class ListRowWidget extends StatelessWidget {
  final String label;
  final dynamic value;
  final bool emphasize;
  const ListRowWidget({
    super.key,
    required this.label,
    required this.value,
    this.emphasize = false,
  });

  @override
  Widget build(BuildContext context) {
    final baseStyle = Theme.of(context).textTheme.bodyMedium;

    final valueWidget = value is String
        ? Text(
            value as String,
            style: baseStyle?.copyWith(
              color: emphasize ? const Color(0xFF0F766E) : Colors.black87,
              fontWeight: emphasize ? FontWeight.w800 : FontWeight.w600,
            ),
          )
        : (value as Widget);

    return Row(
      children: [
        SizedBox(
          width: 110,
          child: Text(
            label,
            style: baseStyle?.copyWith(
              color: Colors.black54,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const Text(': '),
        valueWidget,
      ],
    );
  }
}
