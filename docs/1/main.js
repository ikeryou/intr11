

_renderer = undefined;
_mainScene = undefined;
_mainCamera = undefined;

_mesh = [];
_light = [];

// 初期設定
init();
function init() {

  // レンダラー
  _renderer = new THREE.WebGLRenderer({
    canvas : $('.mv').get(0),
    alpha : true,
    antialias : false,
    stencil : false,
    powerPreference : 'low-power'
  })
  _renderer.autoClear = true;

  // メインシーン
  _mainScene = new THREE.Scene();

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000);

  var sw = $(window).width();
  var sh = window.innerHeight;

  // 材質
  var mat = new THREE.MeshPhongMaterial({
    color: 0xb65e9c, // ライトあたるところ
    emissive:0x40468c, // 暗いとこと
    specular:0xd35644, // 特にライトあたるところ
    shininess: 50, // ライトの強さ
    flatShading: false,
    side:THREE.DoubleSide,
    wireframe:false
  });

  // 形状
  var geo = new THREE.SphereBufferGeometry(0.5, 20, 20);

  // 3Dオブジェクトたくさんつくる
  for(var i = 0; i < 50; i++) {
    var mesh = new THREE.Mesh(geo, mat);
    _mainScene.add(mesh);

    mesh.position.x = range(sh * 0.2);
    mesh.position.y = range(sh * 0.01);

    _mesh.push(mesh);
  }

  // ライト
  var light = new THREE.PointLight(
    0xce4c3f, // ライトの色 明るい色
    100, // 強さ
    3000, // 大きさ
    0.001 // 精細さ
  );
  _mainScene.add(light);
  _light.push(light);
  light.position.set(0, 0, 0);


  update();
}

// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var sw = $(window).width();
  var sh = window.innerHeight;

  // カメラ設定
  // ピクセル等倍になるように
  _mainCamera.aspect = sw / sh;
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = sh / Math.tan(_mainCamera.fov * Math.PI / 360) / 2;

  // レンダラーの設定
  _renderer.setClearColor(0xe1e1e3, 1); // 背景色
  _renderer.setPixelRatio(window.devicePixelRatio || 1);
  _renderer.setSize(sw, sh);

  // ライトのアニメーション
  // 行ったり来たり
  for(var i = 0; i < _light.length; i++) {
    var light = _light[i];
    var rd = Math.sin(Date.now() * 0.002);
    light.power = map(rd, 0, 100, -1, 1); // 強さ
    light.decay = map(rd, 1, 0, -1, 1); // 精細さ
    // light.distance = map(rd, 10, sw * 0.25, -1, 1); // 大きさ

    // 位置
    var radius = Math.max(sw, sh) * 1;
    light.position.y = map(rd, -radius, radius, -1, 1);
    // light.position.x = map(rd * -1, -sh * 0.2, sh * 0.2, -1, 1);
    light.position.z = map(rd, -radius, radius, -1, 1);
  }

  // 3Dオブジェクトのアニメーション
  // 行ったり来たり
  for(var i = 0; i < _mesh.length; i++) {
    var mesh = _mesh[i];
    var rd = i * 0.04 + Date.now() * 0.002;
    var radius = sw * 0.2;
    mesh.position.x = Math.sin(rd) * radius;
    mesh.position.z = Math.cos(rd) * radius;
    mesh.position.y = Math.cos(rd * 2.5) * radius * 0.25;

    var scale = map(Math.sin(Date.now() * 0.005 + i * 0.5), sw * 0.03, sw * 0.075, -1, 1);
    mesh.scale.set(scale, scale, scale);
  }


  // レンダリング
  _renderer.render(_mainScene, _mainCamera);


  window.requestAnimationFrame(update);
}
