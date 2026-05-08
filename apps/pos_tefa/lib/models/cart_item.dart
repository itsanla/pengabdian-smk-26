import 'package:pos_tefa/models/produksi.dart';

class CartItem {
  const CartItem({
    required this.produksi,
    required this.berat,
    required this.jumlahTerjual,
  });

  final Produksi produksi;
  final double berat;
  final int jumlahTerjual;

  CartItem copyWith({double? berat, int? jumlahTerjual}) {
    return CartItem(
      produksi: produksi,
      berat: berat ?? this.berat,
      jumlahTerjual: jumlahTerjual ?? this.jumlahTerjual,
    );
  }

  double get subtotal => berat * produksi.hargaPersatuan;
}
