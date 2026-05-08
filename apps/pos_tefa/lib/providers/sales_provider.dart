import 'dart:collection';

import 'package:flutter/foundation.dart';

import '../models/penjualan.dart';
import '../services/api_service.dart';

class SalesProvider extends ChangeNotifier {
  SalesProvider({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  final List<Penjualan> _sales = <Penjualan>[];
  bool _isLoading = true;
  bool _isLoadingMore = false;
  String? _errorMessage;
  String _statusMessage = 'Memuat data penjualan...';
  String _searchQuery = '';
  int? _printingSaleId;
  int? pageItems = 1;
  int sizeItems = 10;
  int? _totalItems;

  UnmodifiableListView<Penjualan> get sales =>
      UnmodifiableListView<Penjualan>(_sales);
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get hasMoreSales => pageItems != null;
  String? get errorMessage => _errorMessage;
  String get statusMessage => _statusMessage;
  String get searchQuery => _searchQuery;
  int? get printingSaleId => _printingSaleId;
  int get totalItems => _totalItems ?? _sales.length;

  List<Penjualan> get filteredSales {
    return List<Penjualan>.unmodifiable(_sales);
  }

  void setPrintingSaleId(int? saleId) {
    if (_printingSaleId == saleId) {
      return;
    }

    _printingSaleId = saleId;
    notifyListeners();
  }

  Future<void> loadSales(String token, {String searchQuery = ''}) async {
    resetData(searchQuery: searchQuery);
    await fetchSales(token);
  }

  Future<void> loadMoreSales(String token) async {
    if (pageItems == null || _isLoading || _isLoadingMore) {
      return;
    }

    await fetchSales(token);
  }

  Future<void> fetchSales(String token) async {
    if (pageItems == null) {
      return;
    }

    final currentPage = pageItems!;
    final isInitialLoad = _sales.isEmpty && currentPage == 1;

    if (isInitialLoad) {
      _isLoading = true;
    } else {
      _isLoadingMore = true;
    }

    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.getPenjualan(
        token,
        page: currentPage,
        pageSize: sizeItems,
        search: _searchQuery,
      );

      _sales.addAll(response.items);
      _totalItems = response.totalItems ?? _sales.length;

      if (response.items.length < sizeItems) {
        pageItems = null;
        _statusMessage = _sales.isEmpty
            ? 'Belum ada data penjualan yang tersimpan.'
            : 'Semua data penjualan sudah dimuat.';
      } else {
        pageItems = currentPage + 1;
        _statusMessage =
            'Data penjualan berhasil dimuat. Gulir ke bawah untuk memuat data berikutnya.';
      }
    } on ApiUnauthorizedException catch (error) {
      _errorMessage = error.message;
      _statusMessage = error.message;
      rethrow;
    } on ApiException catch (error) {
      _errorMessage = error.message;
      _statusMessage = error.message;
      rethrow;
    } catch (error) {
      _errorMessage = 'Gagal memuat data penjualan: $error';
      _statusMessage = _errorMessage!;
      rethrow;
    } finally {
      _isLoading = false;
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  Future<PenjualanDetail> loadSaleDetail(String token, int saleId) {
    return _apiService.getPenjualanDetail(token, saleId);
  }

  Future<String> paySale({
    required String token,
    required int saleId,
    required num jumlahBayar,
    required String keterangan,
  }) {
    return _apiService.bayarPenjualan(
      token: token,
      saleId: saleId,
      jumlahBayar: jumlahBayar,
      keterangan: keterangan,
    );
  }

  void clear() {
    _sales.clear();
    _isLoading = true;
    _isLoadingMore = false;
    pageItems = 1;
    _errorMessage = null;
    _statusMessage = 'Memuat data penjualan...';
    _searchQuery = '';
    _totalItems = null;
    _printingSaleId = null;
    notifyListeners();
  }

  void resetData({String? searchQuery}) {
    _sales.clear();
    _isLoading = true;
    _isLoadingMore = false;
    pageItems = 1;
    _errorMessage = null;
    _statusMessage = 'Memuat data penjualan...';
    _searchQuery = searchQuery?.trim() ?? _searchQuery;
    _totalItems = null;
    notifyListeners();
  }
}
