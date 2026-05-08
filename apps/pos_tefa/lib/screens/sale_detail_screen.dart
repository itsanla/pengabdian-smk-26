import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../models/penjualan.dart';
import '../providers/sales_provider.dart';
import '../services/api_service.dart';
import '../services/receipt_printer.dart';
import '../utils/helpers.dart';
import '../widgets/currency_input_field.dart';
import '../widgets/detail_row_widget.dart';

class SaleDetailScreen extends StatefulWidget {
  const SaleDetailScreen({
    super.key,
    required this.sale,
    required this.provider,
    required this.session,
    required this.onSessionExpired,
  });

  final Penjualan sale;
  final SalesProvider provider;
  final AuthSession session;
  final Future<void> Function() onSessionExpired;

  @override
  State<SaleDetailScreen> createState() => _SaleDetailScreenState();
}

class _SaleDetailScreenState extends State<SaleDetailScreen> {
  final TextEditingController _jumlahBayarController = TextEditingController();
  final TextEditingController _keteranganBayarController =
      TextEditingController();

  PenjualanDetail? _detail;
  bool _isLoading = true;
  bool _isPaying = false;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  @override
  void dispose() {
    _jumlahBayarController.dispose();
    _keteranganBayarController.dispose();
    super.dispose();
  }

  Future<void> _loadDetail() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final detail = await widget.provider.loadSaleDetail(
        widget.session.token,
        widget.sale.id,
      );
      if (!mounted) return;
      setState(() {
        _detail = detail;
      });
    } on ApiUnauthorizedException {
      if (!mounted) return;
      await widget.onSessionExpired();
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(error.message)));
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal memuat detail penjualan: $error')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _submitPayment() async {
    final detail = _detail;
    if (detail == null) {
      return;
    }

    final jumlahBayarText = _jumlahBayarController.text.trim();
    final jumlahBayar =
        num.tryParse(jumlahBayarText.replaceAll(RegExp(r'[^\d]'), '')) ?? 0;
    final keterangan = _keteranganBayarController.text.trim();

    if (jumlahBayar <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Nominal pembayaran harus lebih besar dari 0'),
        ),
      );
      return;
    }

    setState(() {
      _isPaying = true;
    });

    try {
      final message = await widget.provider.paySale(
        token: widget.session.token,
        saleId: detail.id,
        jumlahBayar: jumlahBayar,
        keterangan: keterangan,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
      _jumlahBayarController.clear();
      _keteranganBayarController.clear();
      await _loadDetail();
    } on ApiUnauthorizedException {
      if (!mounted) return;
      await widget.onSessionExpired();
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(error.message)));
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menyimpan pembayaran: $error')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isPaying = false;
        });
      }
    }
  }

  Future<void> _printDetail(PenjualanDetail detail) async {
    final shouldPrint = await _showPrintPreview(detail);
    if (!shouldPrint || !mounted) return;

    widget.provider.setPrintingSaleId(detail.id);
    try {
      final printer = ReceiptPrinter();
      final result = await printer.printPenjualanReceipt(detail);
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(result.message)));
    } on ApiUnauthorizedException {
      if (!mounted) return;
      await widget.onSessionExpired();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Gagal print penjualan: $error')));
    } finally {
      if (mounted) {
        widget.provider.setPrintingSaleId(null);
      }
    }
  }

  Future<bool> _showPrintPreview(PenjualanDetail detail) async {
    final preview = ReceiptPrinter().buildPenjualanPreview(detail);

    return await showDialog<bool>(
          context: context,
          builder: (dialogContext) {
            return AlertDialog(
              title: const Text('Preview Struk'),
              content: SizedBox(
                width: 360,
                child: SingleChildScrollView(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F8F8),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE0E0E0)),
                    ),
                    child: SelectableText(
                      preview,
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                        height: 1.45,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(false),
                  child: const Text('Batal'),
                ),
                FilledButton.icon(
                  onPressed: () => Navigator.of(dialogContext).pop(true),
                  icon: const Icon(Icons.print_rounded),
                  label: const Text('Print'),
                ),
              ],
            );
          },
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context) {
    final detail = _detail;

    return Scaffold(
      appBar: AppBar(title: Text('Detail Penjualan #${widget.sale.id}')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : detail == null
          ? const Center(child: Text('Detail penjualan tidak tersedia'))
          : RefreshIndicator(
              onRefresh: _loadDetail,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  DetailRowWidget(
                    label: 'Status',
                    value: detail.status.isEmpty
                        ? '-'
                        : detail.status.capitalize(),
                  ),
                  DetailRowWidget(
                    label: 'Tanggal',
                    value: Helpers.formatTanggal(detail.createdAt),
                  ),
                  DetailRowWidget(
                    label: 'Total Harga',
                    value: Helpers.formatRupiah(detail.totalHarga),
                  ),
                  DetailRowWidget(
                    label: 'Total Terbayar',
                    value: Helpers.formatRupiah(detail.totalTerbayar),
                  ),
                  DetailRowWidget(
                    label: 'Sisa Tagihan',
                    value: Helpers.formatRupiah(detail.sisaTagihan),
                  ),
                  DetailRowWidget(
                    label: 'Keterangan',
                    value: detail.keterangan.trim().isEmpty
                        ? '-'
                        : detail.keterangan,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Item',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.black54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...detail.items.map((item) {
                    final produksi = item.produksi;
                    final komoditas = item.komoditas;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${komoditas.nama} — ${produksi.kodeProduksi}',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Ukuran: ${produksi.ukuran}  •  Kualitas: ${produksi.kualitas}',
                          ),
                          Text('Berat: ${item.berat} ${komoditas.satuan}'),
                          Text('Jumlah: ${item.jumlahTerjual} buah'),
                          Text(
                            'Harga: ${Helpers.formatRupiah(item.hargaSatuan)}  •  Subtotal: ${Helpers.formatRupiah(item.subTotal)}',
                          ),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),
                  if (detail.pembayaran.isNotEmpty) ...[
                    Text(
                      'Riwayat Pembayaran',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.black54,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...detail.pembayaran.map((bayar) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F5F5),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFE0E0E0)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    Helpers.formatRupiah(bayar.jumlahBayar),
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.copyWith(fontWeight: FontWeight.w700),
                                  ),
                                  Text(
                                    bayar.formattedDate,
                                    style: Theme.of(context).textTheme.bodySmall
                                        ?.copyWith(color: Colors.grey),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                bayar.keterangan,
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 16),
                  ],
                  FilledButton.icon(
                    onPressed: widget.provider.printingSaleId == detail.id
                        ? null
                        : () => _printDetail(detail),
                    icon: widget.provider.printingSaleId == detail.id
                        ? const SizedBox(
                            height: 18,
                            width: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.print_rounded),
                    label: Text(
                      widget.provider.printingSaleId == detail.id
                          ? 'Mencetak...'
                          : 'Print Struk',
                    ),
                  ),
                  if (detail.canPay) ...[
                    const SizedBox(height: 20),
                    Text(
                      'Bayar Penjualan',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 10),
                    CurrencyInputField(
                      controller: _jumlahBayarController,
                      labelText: 'Jumlah Bayar',
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _keteranganBayarController,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        labelText: 'Keterangan Pembayaran (Opsional)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 10),
                    FilledButton.icon(
                      onPressed: _isPaying ? null : _submitPayment,
                      icon: _isPaying
                          ? const SizedBox(
                              height: 18,
                              width: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(Icons.payments_rounded),
                      label: Text(
                        _isPaying ? 'Menyimpan Pembayaran...' : 'Bayar',
                      ),
                    ),
                  ],
                  const SizedBox(height: 20),
                ],
              ),
            ),
    );
  }
}
