import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/app_models.dart';
import '../models/penjualan.dart';
import '../providers/sales_provider.dart';
import '../services/api_service.dart';
import '../widgets/sales_list_section.dart';
import 'add_sale_screen.dart';
import 'sale_detail_screen.dart';

class SalesScreen extends StatefulWidget {
  const SalesScreen({
    super.key,
    required this.session,
    required this.onOpenPrinter,
    required this.onSessionExpired,
  });

  final AuthSession session;
  final VoidCallback onOpenPrinter;
  final Future<void> Function() onSessionExpired;

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  final SalesProvider _provider = SalesProvider();
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  Timer? _searchDebounce;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_handleScroll);
    Future.microtask(_loadSales);
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController.dispose();
    _scrollController
      ..removeListener(_handleScroll)
      ..dispose();
    _provider.dispose();
    super.dispose();
  }

  void _handleScroll() {
    if (!_scrollController.hasClients) {
      return;
    }

    final position = _scrollController.position;
    if (position.extentAfter > 300) {
      return;
    }

    unawaited(_loadMoreSales());
  }

  Future<void> _loadSales() async {
    await _loadSalesWithSearch(_searchController.text);
  }

  Future<void> _loadSalesWithSearch(String searchQuery) async {
    try {
      await _provider.loadSales(widget.session.token, searchQuery: searchQuery);
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
        SnackBar(content: Text('Gagal memuat data penjualan: $error')),
      );
    }
  }

  void _handleSearchChanged(String value) {
    _searchDebounce?.cancel();
    _searchDebounce = Timer(const Duration(milliseconds: 350), () {
      if (!mounted) return;
      unawaited(_loadSalesWithSearch(value));
    });
  }

  Future<void> _loadMoreSales() async {
    try {
      await _provider.loadMoreSales(widget.session.token);
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
        SnackBar(content: Text('Gagal memuat data penjualan: $error')),
      );
    }
  }

  Future<void> _openSaleDetail(Penjualan sale) async {
    try {
      if (!mounted) return;

      await Navigator.of(context).push<void>(
        MaterialPageRoute(
          builder: (_) => SaleDetailScreen(
            sale: sale,
            provider: _provider,
            session: widget.session,
            onSessionExpired: widget.onSessionExpired,
          ),
        ),
      );

      if (mounted) {
        await _loadSales();
      }
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
    }
  }

  Future<void> _handleCreateSale() async {
    _searchDebounce?.cancel();
    _searchController.clear();
    _provider.clear();
    final created = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => AddSaleScreen(token: widget.session.token),
      ),
    );

    if (created == true && mounted) {
      await _loadSales();
    }
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _provider,
      child: SalesListSection(
        session: widget.session,
        onRefresh: _loadSales,
        onOpenPrinter: widget.onOpenPrinter,
        onSelectSale: _openSaleDetail,
        onCreateSale: _handleCreateSale,
        onSearchChanged: _handleSearchChanged,
        scrollController: _scrollController,
        searchController: _searchController,
      ),
    );
  }
}
