const esbuild = require('esbuild');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'dist/wallet-tool.js',
      minify: true,
      external: ['dns'], // Keep Node.js built-in modules external
      format: 'cjs'
    });
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Output: dist/wallet-tool.js');
    console.log('\n🚀 Usage:');
    console.log('  node dist/wallet-tool.js generate <domain>');
    console.log('  node dist/wallet-tool.js browser');
    console.log('  node dist/wallet-tool.js verify <domain>');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build(); 