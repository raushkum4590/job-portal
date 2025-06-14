// URL encoding reference for common characters in passwords:
// ! → %21
// @ → %40
// # → %23
// $ → %24
// % → %25
// ^ → %5E
// & → %26
// * → %2A
// ( → %28
// ) → %29
// + → %2B
// = → %3D
// [ → %5B
// ] → %5D
// { → %7B
// } → %7D
// | → %7C
// \ → %5C
// : → %3A
// ; → %3B
// " → %22
// ' → %27
// < → %3C
// > → %3E
// , → %2C
// . → %2E
// ? → %3F
// / → %2F

// Example: if password is "myP@ss!" it should be "myP%40ss%21"
console.log('Password encoding helper - check your password for special characters');
console.log('If your password contains special characters, they need to be URL encoded.');
