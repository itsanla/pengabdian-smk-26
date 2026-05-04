import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:pos_tefa/models/penjualan.dart';
import 'package:pos_tefa/models/produksi.dart';

import '../models/app_models.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.errors});

  final String message;
  final Map<String, List<String>>? errors;

  @override
  String toString() => message;
}

class ApiUnauthorizedException extends ApiException {
  ApiUnauthorizedException([
    super.message = 'Sesi login telah berakhir. Silakan login ulang.',
  ]);
}

class PenjualanListResponse {
  PenjualanListResponse({required this.items, this.totalItems});

  final List<Penjualan> items;
  final int? totalItems;
}

class ApiService {
  ApiService({http.Client? client}) : _client = client ?? http.Client();

  static const String baseUrl = 'https://api.smk2batusangkar.tech/api';
  final http.Client _client;

  Uri _uri(String path, [Map<String, Object?>? queryParameters]) {
    final uri = Uri.parse('$baseUrl$path');

    if (queryParameters == null || queryParameters.isEmpty) {
      return uri;
    }

    return uri.replace(
      queryParameters: queryParameters.map(
        (key, value) => MapEntry(key, value?.toString() ?? ''),
      ),
    );
  }

  Never _throwUnauthorized() {
    throw ApiUnauthorizedException();
  }

  Map<String, String> _jsonHeaders({String? token}) {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Map<String, dynamic> _decodeBody(http.Response response) {
    final body = response.body.isEmpty ? '{}' : response.body;
    return jsonDecode(body) as Map<String, dynamic>;
  }

  Never _throwApiError(Map<String, dynamic> body, {int? statusCode}) {
    final rawErrors = body['errors'];
    final errors = <String, List<String>>{};

    if (rawErrors is Map<String, dynamic>) {
      rawErrors.forEach((key, value) {
        if (value is List) {
          errors[key] = value.map((item) => item.toString()).toList();
        } else if (value != null) {
          errors[key] = [value.toString()];
        }
      });
    }

    throw ApiException(
      (body['message'] ?? 'Terjadi kesalahan pada server.') as String,
      errors: errors.isEmpty ? null : errors,
    );
  }

  Future<AuthSession> login({
    required String email,
    required String password,
  }) async {
    final response = await _client.post(
      _uri('/auth/login'),
      headers: _jsonHeaders(),
      body: jsonEncode({'email': email, 'password': password}),
    );

    final body = _decodeBody(response);
    final success = body['success'] == true;

    if (response.statusCode == 401) {
      _throwUnauthorized();
    }

    if (!success || response.statusCode >= 400) {
      _throwApiError(body, statusCode: response.statusCode);
    }

    final data = body['data'] as Map<String, dynamic>;
    return AuthSession.fromJson(data);
  }

  Future<PenjualanListResponse> getPenjualan(
    String token, {
    int page = 1,
    int pageSize = 10,
    String search = '',
  }) async {
    final response = await _client.get(
      _uri('/penjualan', {
        'page': page,
        'pageSize': pageSize,
        if (search.trim().isNotEmpty) 'search': search.trim(),
      }),
      headers: _jsonHeaders(token: token),
    );

    final body = _decodeBody(response);
    final success = body['success'] == true;

    if (response.statusCode == 401) {
      _throwUnauthorized();
    }

    if (!success || response.statusCode >= 400) {
      _throwApiError(body, statusCode: response.statusCode);
    }

    final data = body['data'];
    final items = <Penjualan>[];
    if (data is List) {
      items.addAll(
        data.whereType<Map<String, dynamic>>().map(Penjualan.fromJson),
      );
    }

    final totalItems = _readTotalItems(body);

    return PenjualanListResponse(items: items, totalItems: totalItems);
  }

  int? _readTotalItems(Map<String, dynamic> body) {
    final directValue = body['totalItems'] ?? body['total_items'];
    final directCount = _tryParseInt(directValue);
    if (directCount != null) {
      return directCount;
    }

    final meta = body['meta'];
    if (meta is Map<String, dynamic>) {
      final nestedValue = meta['totalItems'] ?? meta['total_items'];
      return _tryParseInt(nestedValue);
    }

    return null;
  }

  int? _tryParseInt(Object? value) {
    if (value is int) {
      return value;
    }

    if (value is num) {
      return value.toInt();
    }

    if (value is String) {
      return int.tryParse(value);
    }

    return null;
  }

  Future<List<Produksi>> getProductions(String token) async {
    final response = await _client.get(
      _uri('/produksi'),
      headers: _jsonHeaders(token: token),
    );

    final body = _decodeBody(response);
    final success = body['success'] == true;

    if (response.statusCode == 401) {
      _throwUnauthorized();
    }

    if (!success || response.statusCode >= 400) {
      _throwApiError(body, statusCode: response.statusCode);
    }

    final data = body['data'];
    if (data is! List) {
      return const <Produksi>[];
    }

    return data
        .whereType<Map<String, dynamic>>()
        .map(Produksi.fromJson)
        .toList(growable: false);
  }

  Future<PenjualanDetail> getPenjualanDetail(String token, int id) async {
    final response = await _client.get(
      _uri('/penjualan/$id'),
      headers: _jsonHeaders(token: token),
    );

    final body = _decodeBody(response);
    final success = body['success'] == true;

    if (response.statusCode == 401) {
      _throwUnauthorized();
    }

    if (!success || response.statusCode >= 400) {
      _throwApiError(body, statusCode: response.statusCode);
    }

    final data = body['data'];
    if (data is! Map<String, dynamic>) {
      throw ApiException('Invalid response data for penjualan detail');
    }

    return PenjualanDetail.fromJson(data);
  }

  Future<String> createPenjualan({
    required String token,
    required String keterangan,
    required List<Map<String, dynamic>> items,
  }) async {
    final response = await _client.post(
      _uri('/penjualan'),
      headers: _jsonHeaders(token: token),
      body: jsonEncode({'keterangan': keterangan, 'items': items}),
    );

    final body = _decodeBody(response);
    final success = body['success'] == true;

    if (response.statusCode == 401) {
      _throwUnauthorized();
    }

    if (!success || response.statusCode >= 400) {
      _throwApiError(body, statusCode: response.statusCode);
    }

    return (body['message'] ?? 'Penjualan berhasil disimpan.') as String;
  }
}
