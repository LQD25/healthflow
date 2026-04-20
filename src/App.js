import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const G = {
  green: { bg: "#EAF3DE", mid: "#639922", dark: "#27500A", light: "#C0DD97" },
  teal: { bg: "#E1F5EE", mid: "#1D9E75", dark: "#085041", light: "#9FE1CB" },
  amber: { bg: "#FAEEDA", mid: "#BA7517", dark: "#633806", light: "#FAC775" },
  blue: { bg: "#E6F1FB", mid: "#185FA5", dark: "#0C447C", light: "#B5D4F4" },
  gray: { bg: "#F1EFE8", mid: "#5F5E5A", dark: "#2C2C2A", light: "#D3D1C7" },
  red: { bg: "#FCEBEB", mid: "#E24B4A", dark: "#501313", light: "#F7C1C1" },
};

const RECIPES = [
  { id: 1, name: "清炒西兰花", cal: 85, time: "15分钟", tag: "低卡", color: G.green, emoji: "🥦", ingredients: ["西兰花 300g", "大蒜 3瓣", "盐 适量", "橄榄油 1勺"], steps: ["西兰花洗净切小朵，焯水2分钟", "热锅倒油，爆香蒜末", "放入西兰花大火翻炒2分钟", "加盐调味出锅"], protein: 5.6, carb: 8.2, fat: 3.1 },
  { id: 2, name: "番茄炒鸡蛋", cal: 168, time: "10分钟", tag: "家常", color: G.amber, emoji: "🍅", ingredients: ["鸡蛋 3个", "番茄 2个", "盐 适量", "糖 少许", "食用油 1勺"], steps: ["鸡蛋打散，番茄切块", "热锅炒鸡蛋至半熟盛出", "同锅炒番茄，出汁后加鸡蛋", "加盐、糖调味翻炒均匀"], protein: 13.2, carb: 10.5, fat: 8.4 },
  { id: 3, name: "清蒸鲈鱼", cal: 142, time: "25分钟", tag: "高蛋白", color: G.teal, emoji: "🐟", ingredients: ["鲈鱼 1条(约500g)", "姜 5片", "葱 2根", "蒸鱼豉油 2勺", "热油 少许"], steps: ["鲈鱼洗净，背部划刀，塞入姜片", "蒸锅上汽后蒸8-10分钟", "倒掉蒸出的水，铺上葱丝", "淋上豉油，浇热油激香"], protein: 26.4, carb: 0.8, fat: 4.2 },
  { id: 4, name: "紫菜蛋花汤", cal: 55, time: "8分钟", tag: "低卡", color: G.blue, emoji: "🍜", ingredients: ["紫菜 10g", "鸡蛋 1个", "盐 适量", "香油 几滴", "葱花 少许"], steps: ["锅中烧水，水开后放入紫菜", "鸡蛋打散，缓慢倒入锅中", "加盐调味，滴几滴香油", "撒葱花出锅"], protein: 4.8, carb: 3.2, fat: 2.1 },
  { id: 5, name: "香菇炖豆腐", cal: 120, time: "20分钟", tag: "素食", color: G.green, emoji: "🍄", ingredients: ["豆腐 300g", "香菇 6朵", "生抽 1勺", "蚝油 半勺", "葱姜 适量"], steps: ["豆腐切块，香菇泡发切片", "热锅煸炒葱姜，放入香菇翻炒", "加豆腐、生抽、蚝油和少量水", "中小火炖10分钟，收汁出锅"], protein: 11.2, carb: 7.8, fat: 5.3 },
  { id: 6, name: "胡萝卜炒肉丝", cal: 195, time: "15分钟", tag: "均衡", color: G.amber, emoji: "🥕", ingredients: ["猪里脊 150g", "胡萝卜 1根", "生抽 1勺", "淀粉 半勺", "盐 适量"], steps: ["里脊切丝，加生抽、淀粉腌制10分钟", "胡萝卜切丝备用", "热锅炒肉丝至变色盛出", "同锅炒胡萝卜，加肉丝翻炒，调味出锅"], protein: 18.6, carb: 9.4, fat: 7.8 },
];

const FOOD_DB = [
  { name: "米饭(100g)", cal: 116 },
  { name: "鸡胸肉(100g)", cal: 133 },
  { name: "苹果(1个)", cal: 52 },
  { name: "牛奶(250ml)", cal: 163 },
  { name: "燕麦(50g)", cal: 189 },
  { name: "西兰花(100g)", cal: 34 },
  { name: "鸡蛋(1个)", cal: 72 },
  { name: "豆腐(100g)", cal: 76 },
];

const DEFAULT_EXERCISES = [
  { name: "晨跑", icon: "🏃", duration: 30, cal: 280, done: false },
  { name: "瑜伽", icon: "🧘", duration: 45, cal: 180, done: false },
  { name: "力量训练", icon: "🏋️", duration: 40, cal: 320, done: false },
  { name: "骑行", icon: "🚴", duration: 60, cal: 400, done: false },
];


const EXERCISE_PRESETS = [
  { name: "散步", icon: "🚶", met: 3.5 },
  { name: "慢跑", icon: "🏃", met: 7 },
  { name: "游泳", icon: "🏊", met: 8 },
  { name: "骑行", icon: "🚴", met: 6 },
  { name: "力量训练", icon: "🏋️", met: 5 },
  { name: "瑜伽", icon: "🧘", met: 3 },
  { name: "跳绳", icon: "⚡", met: 10 },
  { name: "自定义", icon: "✏️", met: null },
];

function bmiColor(bmi) {
  if (bmi < 18.5) return G.blue;
  if (bmi < 24) return G.green;
  if (bmi < 28) return G.amber;
  return G.red;
}

function bmiLabel(bmi) {
  if (bmi < 18.5) return "偏瘦";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "偏重";
  return "肥胖";
}
function MiniBar({ val, max, color }) {
  return (
    <div style={{ height: 6, background: "#E0E0E0", borderRadius: 3, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${Math.min(100, (val / max) * 100)}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
    </div>
  );
}

function WeightChart({ data }) {
  if (!data.length) return <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 20 }}>暂无数据</div>;
  const vals = data.map(d => d.weight);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const W = 300, H = 110, pad = { l: 36, r: 12, t: 10, b: 28 };
  const x = i => pad.l + i * ((W - pad.l - pad.r) / Math.max(data.length - 1, 1));
  const y = v => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const pts = data.map((d, i) => `${x(i)},${y(d.weight)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      <polyline points={pts} fill="none" stroke={G.teal.mid} strokeWidth={2} strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.weight)} r={3.5} fill={G.teal.mid} />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill={G.gray.mid}>{d.day}</text>
          {i === data.length - 1 && (
            <text x={x(i) + 4} y={y(d.weight) - 8} fontSize={10} fill={G.teal.dark} fontWeight="500">{d.weight}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

function RecipeCard({ r, onClick }) {
  return (
    <div onClick={() => onClick(r)} style={{ background: r.color.bg, borderRadius: 12, padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${r.color.light}` }}>
      <div style={{ fontSize: 28 }}>{r.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 15, color: r.color.dark }}>{r.name}</div>
        <div style={{ fontSize: 12, color: r.color.mid, marginTop: 2 }}>{r.time} · {r.cal} 千卡</div>
      </div>
      <span style={{ background: r.color.light, color: r.color.dark, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{r.tag}</span>
    </div>
  );
}

function RecipeDetail({ r, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: G.teal.mid, fontWeight: 500, fontSize: 14, cursor: "pointer", padding: "0 0 12px 0" }}>← 返回食谱</button>
      <div style={{ background: r.color.bg, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 8 }}>{r.emoji}</div>
        <div style={{ fontWeight: 500, fontSize: 18, color: r.color.dark, textAlign: "center" }}>{r.name}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
          {[["热量", `${r.cal}千卡`], ["蛋白质", `${r.protein}g`], ["碳水", `${r.carb}g`], ["脂肪", `${r.fat}g`]].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: r.color.dark }}>{v}</div>
              <div style={{ fontSize: 11, color: r.color.mid }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: G.gray.dark, marginBottom: 8 }}>食材清单</div>
        {r.ingredients.map((ing, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `0.5px solid ${G.gray.light}` }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: r.color.mid, flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{ing}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14, color: G.gray.dark, marginBottom: 8 }}>烹饪步骤</div>
        {r.steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: r.color.mid, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 登录/注册界面
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit() {
    if (!email || !password) { setMsg("请填写邮箱和密码"); return; }
    setLoading(true);
    setMsg("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("登录失败：" + (error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message));
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg("注册失败：" + error.message);
      else setMsg("注册成功！请检查邮箱验证后登录 📧");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: G.green.bg }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
      <div style={{ fontWeight: 500, fontSize: 24, color: G.green.dark, marginBottom: 4 }}>HealthFlow</div>
      <div style={{ fontSize: 13, color: G.green.mid, marginBottom: 32 }}>你的健康管理助手</div>

      <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, padding: 24, border: `1px solid ${G.green.light}` }}>
        <div style={{ display: "flex", marginBottom: 20, background: G.green.bg, borderRadius: 12, padding: 4 }}>
          {[["login", "登录"], ["signup", "注册"]].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setMsg(""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14, background: mode === id ? G.green.mid : "transparent", color: mode === id ? "#fff" : G.green.dark }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: G.gray.mid, marginBottom: 4 }}>邮箱</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="输入邮箱" type="email" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `0.5px solid ${G.green.light}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: G.gray.mid, marginBottom: 4 }}>密码</div>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="输入密码（至少6位）" type="password" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `0.5px solid ${G.green.light}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>

        {msg && <div style={{ fontSize: 13, color: msg.includes("成功") ? G.green.mid : "#E24B4A", marginBottom: 12, textAlign: "center" }}>{msg}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: G.green.mid, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
        </button>
      </div>
    </div>
  );
}
function ProfileTab({ user, onSignOut }) {
  const [height, setHeight] = useState(localStorage.getItem("hf_height") || "");
  const [weight, setWeight] = useState(localStorage.getItem("hf_weight") || "");
  const [age, setAge] = useState(localStorage.getItem("hf_age") || "");
  const [gender, setGender] = useState(localStorage.getItem("hf_gender") || "male");
  const [goal, setGoal] = useState(localStorage.getItem("hf_goal") || "1800");
  const [saved, setSaved] = useState(false);

  const bmi = height && weight ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1) : null;
  const bc = bmi ? bmiColor(parseFloat(bmi)) : G.gray;

  function calcTDEE() {
    if (!height || !weight || !age) return null;
    const h = parseFloat(height), w = parseFloat(weight), a = parseFloat(age);
    const bmr = gender === "male" ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
    return Math.round(bmr * 1.55);
  }

  const tdee = calcTDEE();

  function save() {
    localStorage.setItem("hf_height", height);
    localStorage.setItem("hf_weight", weight);
    localStorage.setItem("hf_age", age);
    localStorage.setItem("hf_gender", gender);
    localStorage.setItem("hf_goal", goal);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ background: G.green.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.green.light}` }}>
        <div style={{ fontSize: 13, color: G.green.mid, marginBottom: 2 }}>当前账号</div>
        <div style={{ fontWeight: 500, fontSize: 14, color: G.green.dark }}>{user.email}</div>
        <button onClick={onSignOut} style={{ marginTop: 8, background: "none", border: `0.5px solid ${G.red.mid}`, borderRadius: 20, padding: "4px 14px", color: G.red.mid, fontSize: 12, cursor: "pointer" }}>退出登录</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `0.5px solid ${G.gray.light}` }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 12 }}>个人资料</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[["身高", height, setHeight, "cm"], ["体重", weight, setWeight, "kg"], ["年龄", age, setAge, "岁"]].map(([label, val, setter, unit]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>{label}（{unit}）</div>
              <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder={`输入${label}`} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.gray.light}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>性别</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["male", "男"], ["female", "女"]].map(([val, label]) => (
                <button key={val} onClick={() => setGender(val)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `0.5px solid ${gender === val ? G.green.mid : G.gray.light}`, background: gender === val ? G.green.bg : "#fff", color: gender === val ? G.green.dark : G.gray.mid, fontSize: 13, cursor: "pointer" }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bmi && (
        <div style={{ background: bc.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${bc.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: bc.dark, marginBottom: 8 }}>BMI 指数</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontWeight: 500, fontSize: 36, color: bc.dark }}>{bmi}</div>
            <div style={{ fontSize: 16, color: bc.mid }}>{bmiLabel(parseFloat(bmi))}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: bc.mid, marginBottom: 4 }}>
              <span>偏瘦 &lt;18.5</span><span>正常 18.5-24</span><span>偏重 24-28</span><span>肥胖 &gt;28</span>
            </div>
            <div style={{ height: 8, background: `linear-gradient(to right, ${G.blue.mid}, ${G.green.mid}, ${G.amber.mid}, ${G.red.mid})`, borderRadius: 4, position: "relative" }}>
              <div style={{ position: "absolute", top: -3, left: `${Math.min(95, Math.max(2, (parseFloat(bmi) - 15) / 20 * 100))}%`, width: 14, height: 14, borderRadius: 7, background: "#fff", border: `2px solid ${bc.mid}`, transform: "translateX(-50%)" }} />
            </div>
          </div>
        </div>
      )}

      {tdee && (
        <div style={{ background: G.teal.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.teal.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.teal.dark, marginBottom: 4 }}>每日消耗估算（TDEE）</div>
          <div style={{ fontWeight: 500, fontSize: 28, color: G.teal.dark }}>{tdee} <span style={{ fontSize: 14 }}>千卡/天</span></div>
          <div style={{ fontSize: 12, color: G.teal.mid, marginTop: 4 }}>基于身高体重年龄，适度活动量估算</div>
        </div>
      )}

      <div style={{ background: G.amber.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.amber.light}` }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: G.amber.dark, marginBottom: 8 }}>每日热量目标</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {tdee && [["减脂", Math.round(tdee * 0.8)], ["维持", tdee], ["增肌", Math.round(tdee * 1.15)]].map(([label, val]) => (
            <button key={label} onClick={() => setGoal(String(val))} style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: `0.5px solid ${String(val) === goal ? G.amber.mid : G.amber.light}`, background: String(val) === goal ? G.amber.mid : G.amber.bg, color: String(val) === goal ? "#fff" : G.amber.dark, fontSize: 12, cursor: "pointer" }}>
              {label}<br /><span style={{ fontSize: 11 }}>{val}千卡</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="number" value={goal} onChange={e => setGoal(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${G.amber.light}`, fontSize: 14, outline: "none" }} />
          <span style={{ fontSize: 12, color: G.amber.mid }}>千卡/天</span>
        </div>
      </div>

      <button onClick={save} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: saved ? G.teal.mid : G.green.mid, color: "#fff", fontWeight: 500, fontSize: 15, cursor: "pointer" }}>
        {saved ? "✓ 已保存" : "保存设置"}
      </button>
    </div>
  );
}
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [dietSub, setDietSub] = useState("record");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [foodLog, setFoodLog] = useState([]);
  const [weights, setWeights] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [newW, setNewW] = useState("");
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([
    { role: "ai", text: "你好！我是你的AI健康助手 🌿 可以问我饮食、运动、体重管理等任何健康问题！" }
  ]);
  const [search, setSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  const [showAddEx, setShowAddEx] = useState(false);
  const [newEx, setNewEx] = useState({ name: "", icon: "🏃", duration: 30, cal: 0, preset: null });
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

useEffect(() => {
  if (!user || initialized) return;

  const loadAll = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const uid = user.id;

    const [f, w, e] = await Promise.all([
      supabase.from('food_logs').select('*').eq('user_id', uid).eq('created_at', today).order('id'),
      supabase.from('weight_logs').select('*').eq('user_id', uid).order('created_at'),
      supabase.from('exercise_logs').select('*').eq('user_id', uid).eq('created_at', today).order('id'),
    ]);

    if (f.data) setFoodLog(f.data);
    if (w.data) setWeights(w.data);

    if (e.data && e.data.length) {
      setExercises(e.data);
    } else {
      const def = DEFAULT_EXERCISES.map(ex => ({
        ...ex,
        user_id: uid,
        created_at: today
      }));

      const { data } = await supabase
        .from('exercise_logs')
        .insert(def)
        .select();

      if (data) setExercises(data);
    }

    setInitialized(true); // ✅ 防止重复执行
    setLoading(false);
  };

  loadAll();
}, [user, initialized]);

  async function addFood(f) {
    const { data } = await supabase.from('food_logs').insert([{ name: f.name, cal: f.cal, meal: '加餐', user_id: user.id }]).select();
    if (data) setFoodLog(prev => [...prev, ...data]);
    setSearch("");
  }

  async function addWeight() {
    if (!newW) return;
    const day = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
    const { data } = await supabase.from('weight_logs').insert([{ weight: parseFloat(newW), day, user_id: user.id }]).select();
    if (data) setWeights(prev => [...prev, ...data]);
    setNewW("");
  }

  async function toggleExercise(ex, i) {
    const updated = !ex.done;
    await supabase.from('exercise_logs').update({ done: updated }).eq('id', ex.id);
    setExercises(prev => prev.map((e, j) => j === i ? { ...e, done: updated } : e));
  }

function calcExCal(met, duration) {
  const w = parseFloat(localStorage.getItem("hf_weight") || "65");
  return Math.round(met * w * (duration / 60));
}

function handlePresetChange(preset) {
  const dur = newEx.duration || 30;
  const cal = preset.met ? calcExCal(preset.met, dur) : newEx.cal;
  setNewEx({ ...newEx, name: preset.name === "自定义" ? "" : preset.name, icon: preset.icon, cal, preset });
}

function handleDurChange(dur) {
  const cal = newEx.preset?.met ? calcExCal(newEx.preset.met, dur) : newEx.cal;
  setNewEx({ ...newEx, duration: parseInt(dur), cal });
}

async function addExercise() {
  if (!newEx.name || !newEx.duration || !newEx.cal) return;
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('exercise_logs').insert([{
    name: newEx.name, icon: newEx.icon, duration: newEx.duration,
    cal: newEx.cal, done: false, user_id: user.id, created_at: today
  }]).select();
  if (data) setExercises(prev => [...prev, ...data]);
  setNewEx({ name: "", icon: "🏃", duration: 30, cal: 0, preset: null });
  setShowAddEx(false);
}
  async function signOut() {
    await supabase.auth.signOut();
    setFoodLog([]); setWeights([]); setExercises([]);
  }

  async function sendAI() {
    if (!aiMsg.trim()) return;
    const userMsg = aiMsg.trim();
    setAiMsg("");
    const newHistory = [...aiHistory, { role: "user", text: userMsg }];
    setAiHistory(newHistory);
    setAiLoading(true);
    try {
      const totalCal = foodLog.reduce((s, f) => s + f.cal, 0);
      const curW = weights.length ? weights[weights.length - 1].weight : "未记录";
      const context = `用户今日饮食: ${foodLog.map(f => f.name).join("、") || "暂无"}，总热量${totalCal}千卡。体重: ${curW}kg。已完成运动: ${exercises.filter(e => e.done).map(e => e.name).join("、") || "暂无"}。`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `你是专业中文健康顾问，专注饮食管理、体重控制和健康运动。${context}请用简洁友好的中文回答，控制在150字以内。`,
          messages: newHistory.filter(m => m.role === "user").map(m => ({ role: "user", content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "抱歉，请稍后再试";
      setAiHistory([...newHistory, { role: "ai", text: reply }]);
    } catch {
      setAiHistory([...newHistory, { role: "ai", text: "网络异常，请稍后再试 🙏" }]);
    }
    setAiLoading(false);
  }

  const totalCal = foodLog.reduce((s, f) => s + f.cal, 0);
  const goal = 1800;
  const exDone = exercises.filter(e => e.done).length;
  const exCal = exercises.filter(e => e.done).reduce((s, e) => s + e.cal, 0);
  const curW = weights.length ? weights[weights.length - 1].weight : "--";
  const filteredFood = FOOD_DB.filter(f => f.name.includes(search));
  const filteredRecipes = RECIPES.filter(r => r.name.includes(recipeSearch) || r.tag.includes(recipeSearch));

  const tabs = [
    { id: "home", icon: "🏠", label: "首页" },
    { id: "diet", icon: "🥗", label: "饮食" },
    { id: "weight", icon: "⚖️", label: "体重" },
    { id: "exercise", icon: "🏃", label: "运动" },
    { id: "ai", icon: "🤖", label: "AI助手" },
    { id: "profile", icon: "👤", label: "我的" },
  ];

  if (authLoading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12 }}>
      <div style={{ fontSize: 40 }}>🌿</div>
      <div style={{ color: G.green.mid, fontSize: 14 }}>HealthFlow 启动中...</div>
    </div>
  );

  if (!user) return <AuthScreen />;

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12 }}>
      <div style={{ fontSize: 40 }}>🌿</div>
      <div style={{ color: G.green.mid, fontSize: 14 }}>加载数据中...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "sans-serif", paddingBottom: 70 }}>
      <div style={{ background: G.green.mid, padding: "18px 20px 14px", borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontSize: 11, opacity: 0.85 }}>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div style={{ color: "#fff", fontWeight: 500, fontSize: 20, marginTop: 2 }}>HealthFlow 🌿</div>
          </div>
          <button onClick={signOut} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}>退出</button>
        </div>
        <div style={{ color: "#fff", fontSize: 11, opacity: 0.7, marginTop: 4 }}>{user.email}</div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {tab === "home" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "今日热量", val: `${totalCal} / ${goal}`, sub: "千卡", color: G.amber },
                { label: "当前体重", val: `${curW}`, sub: "kg", color: G.teal },
                { label: "已燃脂", val: `${exCal}`, sub: "千卡", color: G.green },
                { label: "运动打卡", val: `${exDone} / ${exercises.length}`, sub: "项", color: G.blue },
              ].map(c => (
                <div key={c.label} style={{ background: c.color.bg, borderRadius: 12, padding: "14px", border: `1px solid ${c.color.light}` }}>
                  <div style={{ fontSize: 11, color: c.color.mid, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontWeight: 500, fontSize: 22, color: c.color.dark }}>{c.val}</div>
                  <div style={{ fontSize: 11, color: c.color.mid }}>{c.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background: G.green.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${G.green.light}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: G.green.dark, marginBottom: 10 }}>今日热量进度</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MiniBar val={totalCal} max={goal} color={G.green.mid} />
                <span style={{ fontSize: 12, color: G.green.mid, whiteSpace: "nowrap" }}>{Math.round(totalCal / goal * 100)}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: G.green.mid }}>
                <span>已摄入 {totalCal} 千卡</span>
                <span>还剩 {Math.max(0, goal - totalCal)} 千卡</span>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>快捷入口</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["🥗", "记录饮食", "diet", "record"], ["🍽️", "健康食谱", "diet", "recipes"], ["⚖️", "记录体重", "weight", ""]].map(([icon, label, t, sub]) => (
                  <button key={label} onClick={() => { setTab(t); if (sub) setDietSub(sub); }} style={{ background: "#fff", border: `0.5px solid ${G.green.light}`, borderRadius: 10, padding: "12px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ fontSize: 11, color: G.green.dark }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "diet" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["record", "饮食记录"], ["recipes", "健康食谱"]].map(([id, label]) => (
                <button key={id} onClick={() => { setDietSub(id); setSelectedRecipe(null); }} style={{ flex: 1, padding: "8px 0", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13, background: dietSub === id ? G.green.mid : G.green.bg, color: dietSub === id ? "#fff" : G.green.dark }}>
                  {label}
                </button>
              ))}
            </div>
            {dietSub === "record" && (
              <div>
                <div style={{ background: G.amber.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${G.amber.light}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: G.amber.dark }}>今日摄入</span>
                    <span style={{ fontWeight: 500, fontSize: 18, color: G.amber.dark }}>{totalCal} <span style={{ fontSize: 12 }}>/ {goal} 千卡</span></span>
                  </div>
                  <MiniBar val={totalCal} max={goal} color={G.amber.mid} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索食物添加..." style={{ width: "100%", padding: "8px 12px", borderRadius: 20, border: `0.5px solid ${G.green.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                </div>
                {search && (
                  <div style={{ marginBottom: 14 }}>
                    {filteredFood.map(f => (
                      <div key={f.name} onClick={() => addFood(f)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${G.gray.light}`, cursor: "pointer" }}>
                        <span style={{ fontSize: 14 }}>{f.name}</span>
                        <span style={{ fontSize: 13, color: G.amber.mid }}>+{f.cal} 千卡</span>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>今日记录</div>
                  {foodLog.length === 0 && <div style={{ fontSize: 13, color: G.gray.mid, textAlign: "center", padding: 20 }}>今日还没有饮食记录</div>}
                  {foodLog.map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `0.5px solid ${G.gray.bg}` }}>
                      <span style={{ fontSize: 14 }}>{f.name}</span>
                      <span style={{ fontSize: 13, color: G.amber.mid }}>{f.cal} 千卡</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dietSub === "recipes" && !selectedRecipe && (
              <div>
                <div style={{ fontSize: 13, color: G.gray.mid, marginBottom: 10 }}>🍜 中餐健康家常系列 · 第一版</div>
                <div style={{ marginBottom: 12 }}>
                  <input value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} placeholder="搜索食谱或标签..." style={{ width: "100%", padding: "8px 12px", borderRadius: 20, border: `0.5px solid ${G.green.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredRecipes.map(r => <RecipeCard key={r.id} r={r} onClick={setSelectedRecipe} />)}
                </div>
              </div>
            )}
            {dietSub === "recipes" && selectedRecipe && (
              <RecipeDetail r={selectedRecipe} onBack={() => setSelectedRecipe(null)} />
            )}
          </div>
        )}

        {tab === "weight" && (
          <div>
            <div style={{ background: G.teal.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.teal.light}` }}>
              <div style={{ fontSize: 13, color: G.teal.mid, marginBottom: 4 }}>当前体重</div>
              <div style={{ fontWeight: 500, fontSize: 32, color: G.teal.dark }}>{curW} <span style={{ fontSize: 16 }}>kg</span></div>
              <div style={{ fontSize: 12, color: G.teal.mid }}>目标体重 70.0 kg</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `0.5px solid ${G.teal.light}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>体重趋势</div>
              <WeightChart data={weights} />
            </div>
            <div style={{ background: G.green.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${G.green.light}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: G.green.dark, marginBottom: 10 }}>记录今日体重</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" value={newW} onChange={e => setNewW(e.target.value)} placeholder="输入体重 (kg)" style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: `0.5px solid ${G.green.light}`, fontSize: 14, outline: "none" }} />
                <button onClick={addWeight} style={{ background: G.green.mid, color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>记录</button>
              </div>
            </div>
          </div>
        )}

        {tab === "exercise" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: G.green.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${G.green.light}` }}>
                <div style={{ fontSize: 11, color: G.green.mid }}>已完成</div>
                <div style={{ fontWeight: 500, fontSize: 22, color: G.green.dark }}>{exDone}<span style={{ fontSize: 13 }}>/{exercises.length}</span></div>
              </div>
              <div style={{ background: G.amber.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${G.amber.light}` }}>
                <div style={{ fontSize: 11, color: G.amber.mid }}>消耗热量</div>
                <div style={{ fontWeight: 500, fontSize: 22, color: G.amber.dark }}>{exCal}<span style={{ fontSize: 13 }}>千卡</span></div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 10 }}>今日运动计划</div>
           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {exercises.map((ex, i) => (
                <div key={i} onClick={() => toggleExercise(ex, i)} style={{ display: "flex", alignItems: "center", gap: 12, background: ex.done ? G.green.bg : "#fff", borderRadius: 12, padding: "14px", cursor: "pointer", border: `1px solid ${ex.done ? G.green.light : G.gray.light}` }}>
                  <div style={{ fontSize: 24 }}>{ex.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: ex.done ? G.green.dark : "#333" }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: G.gray.mid }}>{ex.duration}分钟 · 约{ex.cal}千卡</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${ex.done ? G.green.mid : G.gray.light}`, background: ex.done ? G.green.mid : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>
                    {ex.done ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              {!showAddEx ? (
                <button onClick={() => setShowAddEx(true)} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: `1px dashed ${G.green.light}`, background: "transparent", color: G.green.mid, fontSize: 14, cursor: "pointer" }}>
                  + 添加运动
                </button>
              ) : (
                <div style={{ background: G.green.bg, borderRadius: 12, padding: 14, border: `1px solid ${G.green.light}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: G.green.dark, marginBottom: 10 }}>添加运动</div>
                  <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 6 }}>选择类型</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
                    {EXERCISE_PRESETS.map(p => (
                      <button key={p.name} onClick={() => handlePresetChange(p)} style={{ padding: "6px 0", borderRadius: 8, border: `0.5px solid ${newEx.preset?.name === p.name ? G.green.mid : G.gray.light}`, background: newEx.preset?.name === p.name ? G.green.mid : "#fff", color: newEx.preset?.name === p.name ? "#fff" : G.gray.dark, fontSize: 11, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 16 }}>{p.icon}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                  {newEx.preset?.name === "自定义" && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>运动名称</div>
                      <input value={newEx.name} onChange={e => setNewEx({ ...newEx, name: e.target.value })} placeholder="输入运动名称" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.gray.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>时长（分钟）</div>
                      <input type="number" value={newEx.duration} onChange={e => handleDurChange(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.gray.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>消耗热量（千卡）</div>
                      <input type="number" value={newEx.cal} onChange={e => setNewEx({ ...newEx, cal: parseInt(e.target.value) })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.gray.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setShowAddEx(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `0.5px solid ${G.gray.light}`, background: "#fff", color: G.gray.mid, fontSize: 13, cursor: "pointer" }}>取消</button>
                    <button onClick={addExercise} style={{ flex: 2, padding: "10px 0", borderRadius: 10, border: "none", background: G.green.mid, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>确认添加</button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        )}

        {tab === "ai" && (
          <div>
            <div style={{ fontSize: 12, color: G.gray.mid, marginBottom: 12, textAlign: "center" }}>基于你的饮食、体重和运动数据提供个性化建议</div>
            <div style={{ minHeight: 320, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
              {aiHistory.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%", background: m.role === "user" ? G.green.mid : G.green.bg, color: m.role === "user" ? "#fff" : G.green.dark, borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.6, border: m.role === "ai" ? `1px solid ${G.green.light}` : "none" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: G.green.bg, borderRadius: "16px 16px 16px 4px", padding: "10px 14px", fontSize: 14, color: G.green.mid, border: `1px solid ${G.green.light}` }}>思考中...</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={aiMsg} onChange={e => setAiMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAI()} placeholder="问我任何健康问题..." style={{ flex: 1, padding: "10px 14px", borderRadius: 22, border: `0.5px solid ${G.green.light}`, fontSize: 14, outline: "none" }} />
              <button onClick={sendAI} style={{ background: G.green.mid, color: "#fff", border: "none", borderRadius: 22, padding: "0 18px", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>发送</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {["今天吃什么好？", "如何加快减脂？", "运动后怎么补充营养？"].map(q => (
                <button key={q} onClick={() => setAiMsg(q)} style={{ background: G.green.bg, color: G.green.dark, border: `0.5px solid ${G.green.light}`, borderRadius: 16, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {tab === "profile" && (
        <ProfileTab user={user} onSignOut={signOut} />
       )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#fff", borderTop: `0.5px solid ${G.gray.light}`, display: "flex", zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0 8px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, color: tab === t.id ? G.green.mid : G.gray.mid, fontWeight: tab === t.id ? 500 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}