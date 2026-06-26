import { hasJwtRole, parseRolesFromJwt } from '../jwtRoles';

// payload: {"roles":"ROLE_CLIENTE,ROLE_USER"}
const TOKEN_CLIENTE =
  'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfQ0xJRU5URSxST0xFX1VTRVIifQ.signature';

describe('parseRolesFromJwt', () => {
  it('retorna vazio para token nulo', () => {
    expect(parseRolesFromJwt(null)).toEqual([]);
  });

  it('extrai roles conhecidas do payload', () => {
    expect(parseRolesFromJwt(TOKEN_CLIENTE)).toEqual(['ROLE_CLIENTE', 'ROLE_USER']);
  });
});

describe('hasJwtRole', () => {
  it('detecta role presente', () => {
    expect(hasJwtRole(['ROLE_CLIENTE'], 'ROLE_CLIENTE')).toBe(true);
    expect(hasJwtRole(['ROLE_CLIENTE'], 'ROLE_ADMIN')).toBe(false);
  });
});
