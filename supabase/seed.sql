-- =============================================================================
-- Seed / Demo Data — Alisson Joias ERP Finance Module
-- =============================================================================
-- Este arquivo contém dados FICTÍCIOS e REALISTAS para demonstração do módulo
-- financeiro de joalheria. Não são dados reais de clientes ou fornecedores.
--
-- Como aplicar:
--   psql "$DATABASE_URL" -f supabase/seed.sql
--   ou via Supabase Dashboard > SQL Editor
--
-- As migrations estruturais (supabase/migrations/) devem ser aplicadas ANTES
-- deste seed. Este arquivo usa ON CONFLICT para ser idempotente.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Clientes realistas de joalheria
-- ---------------------------------------------------------------------------
insert into public.customers (
  id,
  name,
  email,
  phone,
  segment,
  billing_street,
  billing_city,
  billing_region,
  billing_postal_code,
  billing_country
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Aurora & Co. Fine Jewelry',
    'financeiro@aurorafinejewelry.com',
    '+55 11 98888-2049',
    'Personalizados de alto ticket',
    'Rua Haddock Lobo, 1310',
    'São Paulo',
    'SP',
    '01414-002',
    'BR'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Carvalho Atelier',
    'carla@carvalhoatelier.com',
    '+55 21 97777-2048',
    'Reparos e manutenção',
    'Av. Ataulfo de Paiva, 520',
    'Rio de Janeiro',
    'RJ',
    '22440-033',
    'BR'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Northline Wholesale Jewelers',
    'ap@northlinewholesale.com',
    '+1 212 555 2047',
    'Atacado recorrente',
    '516 Madison Ave',
    'New York',
    'NY',
    '10022',
    'US'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Diamond Crest Retail',
    'compras@diamondcrestretail.com',
    '+55 31 96666-2046',
    'Varejo multiloja',
    'Av. do Contorno, 8100',
    'Belo Horizonte',
    'MG',
    '30110-059',
    'BR'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Helena Martins Bridal',
    'helena@martinsbridal.com',
    '+55 51 95555-2045',
    'Noivas e joias autorais',
    'Rua Padre Chagas, 178',
    'Porto Alegre',
    'RS',
    '90570-080',
    'BR'
  )
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  phone = excluded.phone,
  segment = excluded.segment,
  billing_street = excluded.billing_street,
  billing_city = excluded.billing_city,
  billing_region = excluded.billing_region,
  billing_postal_code = excluded.billing_postal_code,
  billing_country = excluded.billing_country;

-- ---------------------------------------------------------------------------
-- Fornecedores de ouro, diamantes, certificação, componentes e serviços
-- ---------------------------------------------------------------------------
insert into public.vendors (id, name, category, email, phone)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'GoldSource Refinery',
    'raw_materials',
    'billing@goldsource.example',
    '+55 11 4002-1100'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'GemCert Labs',
    'certification',
    'finance@gemcert.example',
    '+55 21 4002-2200'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'NovaStone Components',
    'components',
    'ap@novastone.example',
    '+55 31 4002-3300'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'BrightBench Services',
    'services',
    'finance@brightbench.example',
    '+55 51 4002-4400'
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  email = excluded.email,
  phone = excluded.phone;

-- ---------------------------------------------------------------------------
-- Faturas com Custom Orders, Repairs, Wholesale, Retail
-- ---------------------------------------------------------------------------
insert into public.invoices (
  id,
  invoice_number,
  customer_id,
  order_type,
  invoice_date,
  due_date,
  subtotal_cents,
  tax_cents,
  total_cents,
  paid_cents,
  balance_cents,
  status,
  quickbooks_sync_status,
  notes
)
values
  (
    '10000000-0000-4000-8000-000000002049',
    'INV-2049',
    '11111111-1111-4111-8111-111111111111',
    'custom_order',
    '2026-04-21',
    '2026-05-21',
    4080000,
    205000,
    4285000,
    2100000,
    2185000,
    'partial',
    'pending',
    'Anel solitário 18k com montagem sob medida.'
  ),
  (
    '10000000-0000-4000-8000-000000002048',
    'INV-2048',
    '22222222-2222-4222-8222-222222222222',
    'repair',
    '2026-04-18',
    '2026-05-03',
    600000,
    45000,
    645000,
    0,
    645000,
    'pending',
    'synced',
    'Reposição de garra e polimento.'
  ),
  (
    '10000000-0000-4000-8000-000000002047',
    'INV-2047',
    '33333333-3333-4333-8333-333333333333',
    'wholesale',
    '2026-04-12',
    '2026-04-27',
    2940000,
    247500,
    3187500,
    1200000,
    1987500,
    'overdue',
    'pending',
    'Lote de brincos em ouro amarelo.'
  ),
  (
    '10000000-0000-4000-8000-000000002046',
    'INV-2046',
    '44444444-4444-4444-8444-444444444444',
    'retail',
    '2026-04-08',
    '2026-04-23',
    1320000,
    132000,
    1452000,
    1452000,
    0,
    'paid',
    'synced',
    'Reposição de mostruário com pulseiras finas.'
  ),
  (
    '10000000-0000-4000-8000-000000002045',
    'INV-2045',
    '55555555-5555-4555-8555-555555555555',
    'custom_order',
    '2026-03-29',
    '2026-04-13',
    2000000,
    210000,
    2210000,
    600000,
    1610000,
    'overdue',
    'failed',
    'Meia aliança com diamantes e gravação interna.'
  ),
  (
    '10000000-0000-4000-8000-000000002044',
    'INV-2044',
    '11111111-1111-4111-8111-111111111111',
    'wholesale',
    '2026-03-18',
    '2026-04-17',
    2505000,
    244500,
    2749500,
    1454000,
    1295500,
    'partial',
    'synced',
    'Lote de correntes italianas com fechos reforçados.'
  ),
  -- Invoices de meses anteriores para preencher Cash Flow e Revenue Analysis
  (
    '10000000-0000-4000-8000-000000002043',
    'INV-2043',
    '44444444-4444-4444-8444-444444444444',
    'retail',
    '2026-02-15',
    '2026-03-15',
    1850000,
    92500,
    1942500,
    1942500,
    0,
    'paid',
    'synced',
    'Reposição de vitrines com colares de prata.'
  ),
  (
    '10000000-0000-4000-8000-000000002042',
    'INV-2042',
    '22222222-2222-4222-8222-222222222222',
    'repair',
    '2026-01-20',
    '2026-02-20',
    480000,
    24000,
    504000,
    504000,
    0,
    'paid',
    'synced',
    'Solda e acabamento de bracelete vintage.'
  ),
  (
    '10000000-0000-4000-8000-000000002041',
    'INV-2041',
    '33333333-3333-4333-8333-333333333333',
    'wholesale',
    '2025-12-10',
    '2026-01-10',
    3200000,
    160000,
    3360000,
    3360000,
    0,
    'paid',
    'synced',
    'Lote de anéis em ouro branco para Natal.'
  ),
  (
    '10000000-0000-4000-8000-000000002040',
    'INV-2040',
    '55555555-5555-4555-8555-555555555555',
    'custom_order',
    '2025-11-05',
    '2025-12-05',
    2750000,
    137500,
    2887500,
    2887500,
    0,
    'paid',
    'synced',
    'Conjunto de alianças personalizadas com gravação.'
  )
on conflict (id) do update set
  invoice_number = excluded.invoice_number,
  customer_id = excluded.customer_id,
  order_type = excluded.order_type,
  invoice_date = excluded.invoice_date,
  due_date = excluded.due_date,
  subtotal_cents = excluded.subtotal_cents,
  tax_cents = excluded.tax_cents,
  total_cents = excluded.total_cents,
  paid_cents = excluded.paid_cents,
  balance_cents = excluded.balance_cents,
  status = excluded.status,
  quickbooks_sync_status = excluded.quickbooks_sync_status,
  notes = excluded.notes;

-- ---------------------------------------------------------------------------
-- Line items realistas de joalheria
-- ---------------------------------------------------------------------------
insert into public.invoice_line_items (
  id,
  invoice_id,
  description,
  category,
  quantity,
  unit_price_cents,
  tax_cents,
  line_total_cents
)
values
  (
    '20000000-0000-4000-8000-000000002491',
    '10000000-0000-4000-8000-000000002049',
    'Anel solitário 18k com montagem sob medida',
    'service',
    1,
    3250000,
    162500,
    3412500
  ),
  (
    '20000000-0000-4000-8000-000000002492',
    '10000000-0000-4000-8000-000000002049',
    'Certificação e acabamento premium',
    'certification',
    1,
    830000,
    42500,
    872500
  ),
  (
    '20000000-0000-4000-8000-000000002047',
    '10000000-0000-4000-8000-000000002047',
    'Lote com 12 pares de brincos em ouro amarelo',
    'component',
    12,
    245000,
    247500,
    3187500
  ),
  (
    '20000000-0000-4000-8000-000000002048',
    '10000000-0000-4000-8000-000000002048',
    'Reposição de garra e polimento de aliança',
    'service',
    1,
    600000,
    45000,
    645000
  ),
  (
    '20000000-0000-4000-8000-000000002046',
    '10000000-0000-4000-8000-000000002046',
    'Reposição de mostruário com pulseiras finas',
    'retail',
    8,
    165000,
    132000,
    1452000
  ),
  (
    '20000000-0000-4000-8000-000000002045',
    '10000000-0000-4000-8000-000000002045',
    'Meia aliança com diamantes e gravação interna',
    'service',
    1,
    2000000,
    210000,
    2210000
  ),
  (
    '20000000-0000-4000-8000-000000002044',
    '10000000-0000-4000-8000-000000002044',
    'Lote de correntes italianas com fechos reforçados',
    'component',
    15,
    167000,
    244500,
    2749500
  ),
  (
    '20000000-0000-4000-8000-000000002043',
    '10000000-0000-4000-8000-000000002043',
    'Colares de prata 925 para vitrines',
    'retail',
    10,
    185000,
    92500,
    1942500
  ),
  (
    '20000000-0000-4000-8000-000000002042',
    '10000000-0000-4000-8000-000000002042',
    'Solda e acabamento de bracelete vintage',
    'service',
    1,
    480000,
    24000,
    504000
  ),
  (
    '20000000-0000-4000-8000-000000002041',
    '10000000-0000-4000-8000-000000002041',
    'Lote de anéis em ouro branco 18k',
    'component',
    20,
    160000,
    160000,
    3360000
  ),
  (
    '20000000-0000-4000-8000-000000002040',
    '10000000-0000-4000-8000-000000002040',
    'Alianças personalizadas com gravação interna',
    'service',
    2,
    1375000,
    137500,
    2887500
  )
on conflict (id) do update set
  invoice_id = excluded.invoice_id,
  description = excluded.description,
  category = excluded.category,
  quantity = excluded.quantity,
  unit_price_cents = excluded.unit_price_cents,
  tax_cents = excluded.tax_cents,
  line_total_cents = excluded.line_total_cents;

-- ---------------------------------------------------------------------------
-- Pagamentos
-- ---------------------------------------------------------------------------
insert into public.payments (
  id,
  payment_number,
  invoice_id,
  customer_id,
  payment_date,
  amount_cents,
  method,
  status,
  reference
)
values
  (
    '30000000-0000-4000-8000-000000007781',
    'PAY-7781',
    '10000000-0000-4000-8000-000000002049',
    '11111111-1111-4111-8111-111111111111',
    '2026-04-22',
    850000,
    'wire',
    'settled',
    'Entrada de produção'
  ),
  (
    '30000000-0000-4000-8000-000000007798',
    'PAY-7798',
    '10000000-0000-4000-8000-000000002049',
    '11111111-1111-4111-8111-111111111111',
    '2026-04-29',
    1250000,
    'ach',
    'settled',
    'Complemento parcial'
  ),
  (
    '30000000-0000-4000-8000-000000007760',
    'PAY-7760',
    '10000000-0000-4000-8000-000000002047',
    '33333333-3333-4333-8333-333333333333',
    '2026-04-19',
    1200000,
    'wire',
    'pending_deposit',
    'Depósito parcial lote abril'
  ),
  (
    '30000000-0000-4000-8000-000000007745',
    'PAY-7745',
    '10000000-0000-4000-8000-000000002046',
    '44444444-4444-4444-8444-444444444444',
    '2026-04-15',
    1452000,
    'credit_card',
    'settled',
    'Portal corporate'
  ),
  (
    '30000000-0000-4000-8000-000000007708',
    'PAY-7708',
    '10000000-0000-4000-8000-000000002045',
    '55555555-5555-4555-8555-555555555555',
    '2026-04-02',
    350000,
    'pix',
    'settled',
    'Sinal inicial'
  ),
  (
    '30000000-0000-4000-8000-000000007731',
    'PAY-7731',
    '10000000-0000-4000-8000-000000002045',
    '55555555-5555-4555-8555-555555555555',
    '2026-04-09',
    250000,
    'pix',
    'settled',
    'Complemento atelier'
  ),
  -- Pagamentos de meses anteriores para Cash Flow
  (
    '30000000-0000-4000-8000-000000007700',
    'PAY-7700',
    '10000000-0000-4000-8000-000000002043',
    '44444444-4444-4444-8444-444444444444',
    '2026-03-10',
    1942500,
    'credit_card',
    'settled',
    'Pagamento total vitrines prata'
  ),
  (
    '30000000-0000-4000-8000-000000007690',
    'PAY-7690',
    '10000000-0000-4000-8000-000000002042',
    '22222222-2222-4222-8222-222222222222',
    '2026-02-18',
    504000,
    'pix',
    'settled',
    'Pagamento bracelete vintage'
  ),
  (
    '30000000-0000-4000-8000-000000007680',
    'PAY-7680',
    '10000000-0000-4000-8000-000000002041',
    '33333333-3333-4333-8333-333333333333',
    '2026-01-08',
    3360000,
    'wire',
    'settled',
    'Lote Natal ouro branco'
  ),
  (
    '30000000-0000-4000-8000-000000007670',
    'PAY-7670',
    '10000000-0000-4000-8000-000000002040',
    '55555555-5555-4555-8555-555555555555',
    '2025-12-01',
    2887500,
    'wire',
    'settled',
    'Alianças gravadas'
  ),
  (
    '30000000-0000-4000-8000-000000007699',
    'PAY-7699',
    '10000000-0000-4000-8000-000000002044',
    '11111111-1111-4111-8111-111111111111',
    '2026-03-25',
    1454000,
    'ach',
    'settled',
    'Parcial correntes italianas'
  )
on conflict (id) do update set
  payment_number = excluded.payment_number,
  invoice_id = excluded.invoice_id,
  customer_id = excluded.customer_id,
  payment_date = excluded.payment_date,
  amount_cents = excluded.amount_cents,
  method = excluded.method,
  status = excluded.status,
  reference = excluded.reference;

-- ---------------------------------------------------------------------------
-- Accounts Payable
-- ---------------------------------------------------------------------------
insert into public.accounts_payable (
  id,
  ap_number,
  vendor_id,
  category,
  payable_date,
  due_date,
  total_cents,
  paid_cents,
  balance_cents,
  status,
  paid_on
)
values
  (
    '40000000-0000-4000-8000-000000001258',
    'AP-001258',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'raw_materials',
    '2026-04-19',
    '2026-05-03',
    2210000,
    0,
    2210000,
    'pending',
    null
  ),
  (
    '40000000-0000-4000-8000-000000001257',
    'AP-001257',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'certification',
    '2026-04-18',
    '2026-05-05',
    1120000,
    300000,
    820000,
    'partial',
    '2026-04-24'
  ),
  (
    '40000000-0000-4000-8000-000000001256',
    'AP-001256',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'components',
    '2026-04-16',
    '2026-05-07',
    1285000,
    0,
    1285000,
    'pending',
    null
  ),
  (
    '40000000-0000-4000-8000-000000001255',
    'AP-001255',
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'services',
    '2026-04-10',
    '2026-04-22',
    1595000,
    1595000,
    0,
    'paid',
    '2026-04-17'
  ),
  (
    '40000000-0000-4000-8000-000000001254',
    'AP-001254',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'raw_materials',
    '2026-03-28',
    '2026-04-20',
    1145000,
    0,
    1145000,
    'overdue',
    null
  ),
  -- AP de meses anteriores para Cash Flow outflows
  (
    '40000000-0000-4000-8000-000000001253',
    'AP-001253',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'components',
    '2026-03-05',
    '2026-03-25',
    980000,
    980000,
    0,
    'paid',
    '2026-03-20'
  ),
  (
    '40000000-0000-4000-8000-000000001252',
    'AP-001252',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'raw_materials',
    '2026-02-10',
    '2026-03-10',
    1450000,
    1450000,
    0,
    'paid',
    '2026-02-28'
  ),
  (
    '40000000-0000-4000-8000-000000001251',
    'AP-001251',
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'services',
    '2026-01-15',
    '2026-02-15',
    720000,
    720000,
    0,
    'paid',
    '2026-01-30'
  ),
  (
    '40000000-0000-4000-8000-000000001250',
    'AP-001250',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'certification',
    '2025-12-08',
    '2026-01-08',
    550000,
    550000,
    0,
    'paid',
    '2025-12-28'
  )
on conflict (id) do update set
  ap_number = excluded.ap_number,
  vendor_id = excluded.vendor_id,
  category = excluded.category,
  payable_date = excluded.payable_date,
  due_date = excluded.due_date,
  total_cents = excluded.total_cents,
  paid_cents = excluded.paid_cents,
  balance_cents = excluded.balance_cents,
  status = excluded.status,
  paid_on = excluded.paid_on;

-- ---------------------------------------------------------------------------
-- Atividades financeiras recentes
-- ---------------------------------------------------------------------------
insert into public.financial_activities (
  id,
  customer_id,
  invoice_id,
  payment_id,
  title,
  detail,
  amount_cents,
  tone,
  occurred_at
)
values
  (
    '50000000-0000-4000-8000-000000000001',
    '11111111-1111-4111-8111-111111111111',
    '10000000-0000-4000-8000-000000002049',
    '30000000-0000-4000-8000-000000007798',
    'Pagamento registrado',
    'Pagamento parcial via ACH para INV-2049',
    1250000,
    'success',
    now() - interval '18 minutes'
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    '22222222-2222-4222-8222-222222222222',
    '10000000-0000-4000-8000-000000002048',
    null,
    'Fatura em acompanhamento',
    'Reparo da Carvalho Atelier próximo do vencimento',
    645000,
    'warning',
    now() - interval '1 hour'
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    null,
    null,
    null,
    'Sincronização QuickBooks',
    'Faturas pendentes na fila de sincronização',
    0,
    'warning',
    now() - interval '2 hours'
  )
on conflict (id) do update set
  customer_id = excluded.customer_id,
  invoice_id = excluded.invoice_id,
  payment_id = excluded.payment_id,
  title = excluded.title,
  detail = excluded.detail,
  amount_cents = excluded.amount_cents,
  tone = excluded.tone,
  occurred_at = excluded.occurred_at;

-- ---------------------------------------------------------------------------
-- Declarações / Statements
-- ---------------------------------------------------------------------------
insert into public.declarations (
  id,
  declaration_number,
  customer_id,
  title,
  reference_period,
  body,
  issued_on
)
values
  (
    '60000000-0000-4000-8000-000000000001',
    'DEC-2026-001',
    '11111111-1111-4111-8111-111111111111',
    'Declaração de Quitação Parcial',
    'Abril de 2026',
    'Declaramos que a cliente Aurora & Co. Fine Jewelry possui pagamentos parciais registrados para faturas de pedidos personalizados e atacado, restando saldo financeiro conforme extrato do período.',
    '2026-05-01'
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    'DEC-2026-002',
    '44444444-4444-4444-8444-444444444444',
    'Declaração de Fatura Quitada',
    'Abril de 2026',
    'Declaramos que a cliente Diamond Crest Retail possui fatura quitada no período indicado, com pagamento conciliado via cartão corporativo.',
    '2026-05-01'
  )
on conflict (id) do update set
  declaration_number = excluded.declaration_number,
  customer_id = excluded.customer_id,
  title = excluded.title,
  reference_period = excluded.reference_period,
  body = excluded.body,
  issued_on = excluded.issued_on;
