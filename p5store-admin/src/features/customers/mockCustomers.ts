// Placeholder data. The backend only exposes GET /v1/users/{id} (single
// lookup) — there's no list-all-customers endpoint yet. Swap this out for a
// real api/customers.ts call once that ships.
export interface MockCustomer {
  id: number;
  name: string;
  email: string;
  location: string;
  joinDate: string;
  totalSpend: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export const mockCustomers: MockCustomer[] = [
  { id: 1, name: 'Eleanor Vance', email: 'eleanor@example.com', location: 'Western Cape', joinDate: '2023-10-12', totalSpend: 48200, status: 'ACTIVE' },
  { id: 2, name: 'Marcus Thorne', email: 'm.thorne@example.co.za', location: 'Gauteng', joinDate: '2023-11-04', totalSpend: 12950.5, status: 'INACTIVE' },
  { id: 3, name: 'Sarah Jenkins', email: 'sarahj@example.com', location: 'KwaZulu-Natal', joinDate: '2024-01-18', totalSpend: 89400, status: 'ACTIVE' },
  { id: 4, name: 'Thabo Nkosi', email: 'thabo.n@example.com', location: 'Gauteng', joinDate: '2024-02-02', totalSpend: 5600, status: 'ACTIVE' },
  { id: 5, name: 'Priya Naidoo', email: 'priya.naidoo@example.com', location: 'KwaZulu-Natal', joinDate: '2024-03-21', totalSpend: 27300, status: 'ACTIVE' },
  { id: 6, name: 'Johan Botha', email: 'johan.b@example.co.za', location: 'Western Cape', joinDate: '2024-04-09', totalSpend: 0, status: 'INACTIVE' },
  { id: 7, name: 'Lindiwe Dlamini', email: 'lindiwe.d@example.com', location: 'Free State', joinDate: '2024-05-15', totalSpend: 15840, status: 'ACTIVE' },
  { id: 8, name: 'Ryan Pillay', email: 'ryan.pillay@example.com', location: 'Gauteng', joinDate: '2024-06-01', totalSpend: 3200, status: 'ACTIVE' },
];
