describe('Test Environment Setup', () => {
  test('Jest is properly configured', () => {
    expect(true).toBe(true);
  });

  test('Basic math operations work', () => {
    expect(1 + 1).toBe(2);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
    expect(20 / 4).toBe(5);
  });

  test('String operations work', () => {
    const str = 'Sports Talent Assessment';
    expect(str).toContain('Sports');
    expect(str.length).toBe(24);
    expect(str.toLowerCase()).toBe('sports talent assessment');
  });

  test('Array operations work', () => {
    const sports = ['basketball', 'swimming', 'running'];
    expect(sports).toHaveLength(3);
    expect(sports).toContain('swimming');
    sports.push('tennis');
    expect(sports).toHaveLength(4);
  });

  test('Object operations work', () => {
    const assessment = {
      name: 'Test Child',
      age: 10,
      sports: ['swimming', 'running']
    };
    expect(assessment).toHaveProperty('name');
    expect(assessment.age).toBe(10);
    expect(assessment.sports).toBeInstanceOf(Array);
  });
});