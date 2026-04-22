import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const G = {
  green: { bg: "#EAF3DE", mid: "#639922", dark: "#27500A", light: "#C0DD97" },
  teal: { bg: "#E1F5EE", mid: "#1D9E75", dark: "#085041", light: "#9FE1CB" },
  amber: { bg: "#FAEEDA", mid: "#BA7517", dark: "#633806", light: "#FAC775" },
  blue: { bg: "#E6F1FB", mid: "#185FA5", dark: "#0C447C", light: "#B5D4F4" },
  gray: { bg: "#F1EFE8", mid: "#5F5E5A", dark: "#2C2C2A", light: "#D3D1C7" },
  red: { bg: "#FCEBEB", mid: "#E24B4A", dark: "#501313", light: "#F7C1C1" },
  pink: { bg: "#FBEAF0", mid: "#D4537E", dark: "#4B1528", light: "#F4C0D1" },
  purple: { bg: "#EEEDFE", mid: "#7F77DD", dark: "#26215C", light: "#CECBF6" },
};

const STAPLES = [
  { name: "白米饭", cal: 116, icon: "🍚" },
  { name: "糙米饭", cal: 111, icon: "🍚" },
  { name: "馒头", cal: 223, icon: "🫓" },
  { name: "面条", cal: 137, icon: "🍜" },
  { name: "花卷", cal: 211, icon: "🫓" },
  { name: "杂粮饭", cal: 102, icon: "🍚" },
];

const RECIPES = [
  { id: 1, name: "宫保鸡丁", cal: 280, tag: "经典", emoji: "🍗", color: G.amber, time: "20分钟", ingredients: ["鸡胸肉 200g", "花生 30g", "干辣椒 5个", "葱姜蒜 适量", "生抽 1勺", "醋 1勺", "糖 半勺"], steps: ["鸡肉切丁腌制10分钟", "热锅爆香干辣椒葱姜蒜", "下鸡丁翻炒至变色", "加花生和调料翻炒均匀"], protein: 28, carb: 12, fat: 14 },
  { id: 2, name: "麻婆豆腐", cal: 195, tag: "家常", emoji: "🫕", color: G.red, time: "15分钟", ingredients: ["豆腐 300g", "猪肉末 50g", "豆瓣酱 1勺", "花椒 适量", "葱姜蒜 适量"], steps: ["豆腐切块焯水", "炒香肉末和豆瓣酱", "加豆腐和水炖5分钟", "勾芡撒花椒粉出锅"], protein: 14, carb: 8, fat: 11 },
  { id: 3, name: "红烧肉", cal: 395, tag: "硬菜", emoji: "🥩", color: G.amber, time: "60分钟", ingredients: ["五花肉 300g", "生抽 2勺", "老抽 1勺", "糖 1勺", "料酒 2勺", "葱姜 适量"], steps: ["五花肉切块焯水", "炒糖色放入肉块", "加调料和水大火烧开", "小火焖40分钟收汁"], protein: 18, carb: 6, fat: 32 },
  { id: 4, name: "清蒸鲈鱼", cal: 142, tag: "高蛋白", emoji: "🐟", color: G.teal, time: "25分钟", ingredients: ["鲈鱼 500g", "姜 5片", "葱 2根", "蒸鱼豉油 2勺"], steps: ["鲈鱼划刀塞姜片", "蒸8-10分钟", "铺葱丝淋豉油", "浇热油激香"], protein: 26, carb: 1, fat: 4 },
  { id: 5, name: "番茄炒鸡蛋", cal: 168, tag: "家常", emoji: "🍅", color: G.amber, time: "10分钟", ingredients: ["鸡蛋 3个", "番茄 2个", "盐 适量", "糖 少许"], steps: ["鸡蛋打散炒熟盛出", "炒番茄出汁", "加鸡蛋翻炒调味"], protein: 13, carb: 10, fat: 8 },
  { id: 6, name: "蒜蓉西兰花", cal: 85, tag: "低卡", emoji: "🥦", color: G.green, time: "15分钟", ingredients: ["西兰花 300g", "大蒜 5瓣", "盐 适量", "橄榄油 1勺"], steps: ["西兰花焯水", "爆香蒜末", "大火翻炒2分钟", "加盐出锅"], protein: 6, carb: 8, fat: 3 },
  { id: 7, name: "鱼香肉丝", cal: 245, tag: "经典", emoji: "🥢", color: G.amber, time: "20分钟", ingredients: ["猪里脊 200g", "木耳 30g", "胡萝卜 半根", "豆瓣酱 1勺", "醋 1勺", "糖 1勺"], steps: ["肉丝腌制", "炒香豆瓣酱", "下肉丝和配菜翻炒", "加鱼香汁炒匀"], protein: 22, carb: 14, fat: 10 },
  { id: 8, name: "回锅肉", cal: 320, tag: "硬菜", emoji: "🥩", color: G.amber, time: "30分钟", ingredients: ["五花肉 250g", "青椒 2个", "豆瓣酱 1勺", "豆豉 半勺"], steps: ["五花肉煮熟切片", "煸炒出油", "加豆瓣酱豆豉炒香", "下青椒翻炒出锅"], protein: 20, carb: 5, fat: 24 },
  { id: 9, name: "紫菜蛋花汤", cal: 55, tag: "低卡", emoji: "🍜", color: G.blue, time: "8分钟", ingredients: ["紫菜 10g", "鸡蛋 1个", "香油 几滴", "盐 适量"], steps: ["烧水放紫菜", "淋入蛋液", "加盐香油出锅"], protein: 5, carb: 3, fat: 2 },
  { id: 10, name: "清炒时蔬", cal: 65, tag: "素食", emoji: "🥬", color: G.green, time: "10分钟", ingredients: ["时蔬 300g", "大蒜 3瓣", "盐 适量", "食用油 1勺"], steps: ["蔬菜洗净切段", "爆香蒜末", "大火翻炒", "加盐出锅"], protein: 3, carb: 7, fat: 2 },
  { id: 11, name: "糖醋排骨", cal: 380, tag: "硬菜", emoji: "🍖", color: G.amber, time: "45分钟", ingredients: ["排骨 400g", "糖 2勺", "醋 3勺", "生抽 1勺", "料酒 1勺"], steps: ["排骨焯水", "炸至金黄", "调糖醋汁炒匀", "收汁出锅"], protein: 22, carb: 20, fat: 22 },
  { id: 12, name: "水煮牛肉", cal: 310, tag: "经典", emoji: "🥩", color: G.red, time: "30分钟", ingredients: ["牛肉 250g", "豆芽 100g", "豆瓣酱 2勺", "花椒辣椒 适量"], steps: ["牛肉切片腌制", "炒豆瓣酱加水烧开", "下牛肉片烫熟", "浇热油激香"], protein: 30, carb: 8, fat: 16 },
  { id: 13, name: "干煸四季豆", cal: 120, tag: "素食", emoji: "🫘", color: G.green, time: "15分钟", ingredients: ["四季豆 300g", "猪肉末 50g", "干辣椒 适量", "生抽 1勺"], steps: ["四季豆干煸至皮皱", "加肉末炒熟", "加调料翻炒均匀"], protein: 8, carb: 10, fat: 5 },
  { id: 14, name: "酸辣土豆丝", cal: 95, tag: "素食", emoji: "🥔", color: G.amber, time: "10分钟", ingredients: ["土豆 2个", "干辣椒 3个", "醋 1勺", "盐 适量"], steps: ["土豆切丝泡水", "爆香辣椒", "大火翻炒", "加醋盐出锅"], protein: 2, carb: 20, fat: 1 },
  { id: 15, name: "葱爆羊肉", cal: 290, tag: "硬菜", emoji: "🍖", color: G.amber, time: "15分钟", ingredients: ["羊肉 250g", "大葱 2根", "生抽 1勺", "料酒 1勺"], steps: ["羊肉切片腌制", "大火爆炒羊肉", "加葱段翻炒", "调味出锅"], protein: 26, carb: 4, fat: 18 },
  { id: 16, name: "香菇炖鸡", cal: 220, tag: "家常", emoji: "🍗", color: G.teal, time: "40分钟", ingredients: ["鸡腿 2个", "香菇 6朵", "生抽 2勺", "料酒 1勺"], steps: ["鸡腿焯水", "炒香香菇", "加鸡腿和调料", "小火炖30分钟"], protein: 28, carb: 6, fat: 10 },
  { id: 17, name: "扬州炒饭", cal: 320, tag: "主食", emoji: "🍳", color: G.amber, time: "15分钟", ingredients: ["米饭 200g", "鸡蛋 2个", "虾仁 50g", "火腿 30g", "葱花 适量"], steps: ["鸡蛋炒散", "下米饭翻炒", "加配料炒匀", "加盐葱花出锅"], protein: 14, carb: 45, fat: 10 },
  { id: 18, name: "地三鲜", cal: 185, tag: "素食", emoji: "🍆", color: G.green, time: "20分钟", ingredients: ["茄子 1个", "土豆 1个", "青椒 2个", "生抽 1勺", "蒜末 适量"], steps: ["食材切块分别油炸", "爆香蒜末", "加所有食材翻炒", "调味出锅"], protein: 4, carb: 22, fat: 8 },
  { id: 19, name: "酱牛肉", cal: 255, tag: "硬菜", emoji: "🥩", color: G.teal, time: "90分钟", ingredients: ["牛腱子 500g", "生抽 3勺", "老抽 1勺", "料酒 2勺", "香料 适量"], steps: ["牛肉焯水", "加调料和香料", "大火烧开小火卤", "冷却切片"], protein: 35, carb: 3, fat: 12 },
  { id: 20, name: "凉拌黄瓜", cal: 45, tag: "低卡", emoji: "🥒", color: G.green, time: "10分钟", ingredients: ["黄瓜 2根", "蒜末 适量", "醋 1勺", "香油 几滴", "盐 适量"], steps: ["黄瓜拍碎切段", "加蒜末醋盐", "淋香油拌匀"], protein: 2, carb: 6, fat: 1 },
  { id: 21, name: "蒸蛋羹", cal: 85, tag: "低卡", emoji: "🥚", color: G.blue, time: "15分钟", ingredients: ["鸡蛋 2个", "温水 适量", "生抽 1勺", "香油 几滴"], steps: ["鸡蛋打散加温水过滤", "覆保鲜膜蒸12分钟", "淋生抽香油"], protein: 10, carb: 1, fat: 5 },
  { id: 22, name: "辣子鸡", cal: 310, tag: "经典", emoji: "🌶️", color: G.red, time: "30分钟", ingredients: ["鸡腿肉 300g", "干辣椒 20个", "花椒 适量", "葱姜蒜 适量"], steps: ["鸡肉切块腌制炸熟", "爆香花椒辣椒", "下鸡块翻炒", "调味出锅"], protein: 28, carb: 8, fat: 18 },
  { id: 23, name: "韭菜炒鸡蛋", cal: 155, tag: "家常", emoji: "🥚", color: G.green, time: "10分钟", ingredients: ["韭菜 200g", "鸡蛋 3个", "盐 适量", "食用油 1勺"], steps: ["鸡蛋炒散", "下韭菜翻炒", "加盐调味出锅"], protein: 12, carb: 5, fat: 9 },
  { id: 24, name: "冬瓜排骨汤", cal: 180, tag: "汤类", emoji: "🍲", color: G.teal, time: "60分钟", ingredients: ["排骨 300g", "冬瓜 400g", "姜 3片", "盐 适量"], steps: ["排骨焯水", "加水和姜煮沸", "下冬瓜炖30分钟", "加盐出锅"], protein: 20, carb: 8, fat: 8 },
  { id: 25, name: "蚝油生菜", cal: 70, tag: "低卡", emoji: "🥬", color: G.green, time: "8分钟", ingredients: ["生菜 300g", "蚝油 1勺", "蒜末 适量", "食用油 少许"], steps: ["生菜焯水铺盘", "爆香蒜末", "加蚝油炒匀", "淋在生菜上"], protein: 3, carb: 6, fat: 2 },
  { id: 26, name: "粉蒸肉", cal: 360, tag: "硬菜", emoji: "🍖", color: G.amber, time: "60分钟", ingredients: ["五花肉 300g", "蒸肉粉 50g", "豆瓣酱 1勺", "料酒 1勺"], steps: ["五花肉切片腌制", "裹蒸肉粉", "上锅蒸40分钟"], protein: 18, carb: 22, fat: 24 },
  { id: 27, name: "拍黄瓜", cal: 40, tag: "低卡", emoji: "🥒", color: G.green, time: "5分钟", ingredients: ["黄瓜 2根", "蒜末 适量", "辣椒油 少许", "醋盐 适量"], steps: ["黄瓜拍碎", "加所有调料", "拌匀即可"], protein: 1, carb: 5, fat: 1 },
  { id: 28, name: "肉末茄子", cal: 210, tag: "家常", emoji: "🍆", color: G.amber, time: "20分钟", ingredients: ["茄子 2个", "猪肉末 100g", "豆瓣酱 1勺", "蒜末 适量"], steps: ["茄子切条蒸软", "炒香肉末和豆瓣酱", "加茄子翻炒", "调味出锅"], protein: 12, carb: 14, fat: 10 },
  { id: 29, name: "西湖牛肉羹", cal: 165, tag: "汤类", emoji: "🍲", color: G.teal, time: "20分钟", ingredients: ["牛肉末 150g", "豆腐 100g", "鸡蛋 1个", "生抽 1勺", "淀粉 适量"], steps: ["牛肉末炒熟", "加水和豆腐煮沸", "勾芡淋蛋液", "调味出锅"], protein: 18, carb: 8, fat: 6 },
  { id: 30, name: "白灼虾", cal: 115, tag: "高蛋白", emoji: "🦐", color: G.teal, time: "10分钟", ingredients: ["鲜虾 300g", "姜片 适量", "料酒 1勺", "蘸料 适量"], steps: ["水中加姜片料酒煮沸", "下虾煮3分钟", "捞出摆盘", "配蘸料食用"], protein: 22, carb: 1, fat: 2 },
  { id: 31, name: "土豆炖牛肉", cal: 285, tag: "硬菜", emoji: "🥩", color: G.amber, time: "60分钟", ingredients: ["牛腩 300g", "土豆 2个", "生抽 2勺", "料酒 1勺", "葱姜 适量"], steps: ["牛腩切块焯水", "炒香葱姜加牛腩", "加调料和水炖40分钟", "下土豆再炖15分钟"], protein: 25, carb: 20, fat: 12 },
  { id: 32, name: "木须肉", cal: 230, tag: "家常", emoji: "🥢", color: G.amber, time: "20分钟", ingredients: ["猪里脊 150g", "鸡蛋 2个", "木耳 20g", "黄瓜 半根"], steps: ["里脊切片腌制", "鸡蛋炒散盛出", "炒肉片和配菜", "加鸡蛋调味翻炒"], protein: 22, carb: 8, fat: 12 },
  { id: 33, name: "酸菜鱼", cal: 260, tag: "经典", emoji: "🐟", color: G.teal, time: "30分钟", ingredients: ["草鱼 500g", "酸菜 200g", "干辣椒 适量", "花椒 适量"], steps: ["鱼切片腌制", "炒香酸菜加水煮沸", "下鱼片煮熟", "浇热油"], protein: 28, carb: 6, fat: 12 },
  { id: 34, name: "香煎豆腐", cal: 145, tag: "素食", emoji: "🟡", color: G.amber, time: "15分钟", ingredients: ["老豆腐 300g", "生抽 1勺", "蚝油 半勺", "葱花 适量"], steps: ["豆腐切厚片", "煎至两面金黄", "加调料翻炒", "撒葱花出锅"], protein: 14, carb: 5, fat: 8 },
  { id: 35, name: "小鸡炖蘑菇", cal: 240, tag: "家常", emoji: "🍄", color: G.teal, time: "50分钟", ingredients: ["鸡腿 2个", "榛蘑 50g", "生抽 2勺", "料酒 1勺"], steps: ["鸡腿焯水切块", "炒香鸡块", "加蘑菇和调料", "小火炖40分钟"], protein: 26, carb: 8, fat: 12 },
  { id: 36, name: "凉拌木耳", cal: 50, tag: "低卡", emoji: "🖤", color: G.gray, time: "10分钟", ingredients: ["木耳 50g", "蒜末 适量", "醋 1勺", "香油 几滴", "盐 适量"], steps: ["木耳泡发焯水", "加蒜末醋盐", "淋香油拌匀"], protein: 2, carb: 8, fat: 1 },
  { id: 37, name: "青椒炒肉", cal: 220, tag: "家常", emoji: "🌶️", color: G.green, time: "15分钟", ingredients: ["猪肉 200g", "青椒 3个", "生抽 1勺", "蒜末 适量"], steps: ["肉切片腌制", "爆香蒜末炒肉", "下青椒翻炒", "调味出锅"], protein: 20, carb: 6, fat: 12 },
  { id: 38, name: "蒸排骨", cal: 290, tag: "硬菜", emoji: "🍖", color: G.teal, time: "40分钟", ingredients: ["排骨 400g", "豆豉 1勺", "生抽 1勺", "蒜末 适量"], steps: ["排骨腌制20分钟", "铺上豆豉蒜末", "上锅蒸30分钟"], protein: 24, carb: 4, fat: 18 },
  { id: 39, name: "虎皮鸡蛋", cal: 175, tag: "家常", emoji: "🥚", color: G.amber, time: "20分钟", ingredients: ["鸡蛋 4个", "生抽 2勺", "老抽 半勺", "糖 半勺"], steps: ["鸡蛋煮熟去壳", "油炸至虎皮", "加调料卤10分钟"], protein: 14, carb: 4, fat: 12 },
  { id: 40, name: "萝卜炖羊肉", cal: 270, tag: "硬菜", emoji: "🍲", color: G.teal, time: "70分钟", ingredients: ["羊肉 300g", "白萝卜 300g", "姜 5片", "料酒 2勺"], steps: ["羊肉焯水", "加姜料酒炖40分钟", "下萝卜再炖20分钟", "调味出锅"], protein: 26, carb: 10, fat: 14 },
  { id: 41, name: "炒合菜", cal: 130, tag: "素食", emoji: "🥗", color: G.green, time: "15分钟", ingredients: ["豆芽 100g", "韭菜 100g", "粉条 50g", "鸡蛋 1个"], steps: ["粉条泡软", "鸡蛋炒散", "下所有食材翻炒", "调味出锅"], protein: 8, carb: 16, fat: 5 },
  { id: 42, name: "葱油鸡", cal: 250, tag: "经典", emoji: "🍗", color: G.amber, time: "40分钟", ingredients: ["整鸡 半只", "葱 3根", "生抽 2勺", "葱油 适量"], steps: ["整鸡煮熟", "切块摆盘", "铺葱丝淋生抽", "浇热葱油激香"], protein: 30, carb: 2, fat: 14 },
  { id: 43, name: "莲藕排骨汤", cal: 200, tag: "汤类", emoji: "🍲", color: G.teal, time: "70分钟", ingredients: ["排骨 300g", "莲藕 300g", "姜 3片", "盐 适量"], steps: ["排骨焯水", "加水和姜煮沸", "下莲藕炖50分钟", "加盐出锅"], protein: 18, carb: 16, fat: 8 },
  { id: 44, name: "手撕包菜", cal: 75, tag: "素食", emoji: "🥬", color: G.green, time: "10分钟", ingredients: ["包菜 半个", "干辣椒 3个", "蒜末 适量", "生抽 1勺"], steps: ["包菜手撕成片", "爆香辣椒蒜末", "大火翻炒", "加生抽出锅"], protein: 3, carb: 10, fat: 2 },
  { id: 45, name: "蒜泥白肉", cal: 300, tag: "经典", emoji: "🥩", color: G.teal, time: "30分钟", ingredients: ["五花肉 300g", "蒜泥 适量", "生抽 1勺", "辣椒油 1勺"], steps: ["五花肉煮熟切片", "卷黄瓜丝摆盘", "调蒜泥酱汁", "淋在肉上"], protein: 20, carb: 2, fat: 24 },
  { id: 46, name: "三杯鸡", cal: 295, tag: "经典", emoji: "🍗", color: G.amber, time: "30分钟", ingredients: ["鸡腿 2个", "九层塔 适量", "米酒 1杯", "生抽 1杯", "麻油 1杯"], steps: ["鸡腿切块", "三杯料烧开", "下鸡块炖20分钟", "加九层塔收汁"], protein: 28, carb: 6, fat: 16 },
  { id: 47, name: "豆腐脑", cal: 80, tag: "早餐", emoji: "🍮", color: G.blue, time: "10分钟", ingredients: ["嫩豆腐 300g", "卤汁 适量", "葱花 适量", "辣椒油 少许"], steps: ["豆腐脑盛碗", "淋卤汁", "加葱花辣椒油"], protein: 8, carb: 4, fat: 3 },
  { id: 48, name: "炸酱面", cal: 420, tag: "主食", emoji: "🍝", color: G.amber, time: "30分钟", ingredients: ["面条 200g", "猪肉末 100g", "黄酱 2勺", "黄瓜 半根", "豆芽 适量"], steps: ["炒肉末加黄酱炒香", "面条煮熟", "配菜切丝铺面", "加炸酱拌匀"], protein: 20, carb: 58, fat: 14 },
  { id: 49, name: "冰糖银耳羹", cal: 120, tag: "甜品", emoji: "🍮", color: G.blue, time: "40分钟", ingredients: ["银耳 20g", "冰糖 30g", "枸杞 适量", "红枣 5颗"], steps: ["银耳泡发撕小朵", "加水和冰糖", "小火煮30分钟至粘稠", "加枸杞出锅"], protein: 2, carb: 28, fat: 0 },
  { id: 50, name: "皮蛋瘦肉粥", cal: 180, tag: "早餐", emoji: "🍚", color: G.teal, time: "40分钟", ingredients: ["大米 100g", "皮蛋 1个", "瘦肉 80g", "姜丝 适量", "盐 适量"], steps: ["大米煮至软烂", "加入肉丝姜丝", "放皮蛋煮5分钟", "加盐调味"], protein: 14, carb: 28, fat: 4 },
];

const CATEGORIES = [
  { id: "all", label: "全部", emoji: "🍽️" },
  { id: "meat", label: "肉类", emoji: "🥩" },
  { id: "fish", label: "鱼虾", emoji: "🐟" },
  { id: "veg", label: "蔬菜", emoji: "🥦" },
  { id: "soup", label: "汤类", emoji: "🍲" },
  { id: "staple", label: "主食", emoji: "🍚" },
  { id: "other", label: "其他", emoji: "🥢" },
];

const RECIPE_CATEGORY = {
  1: "meat", 2: "other", 3: "meat", 4: "fish", 5: "other",
  6: "veg", 7: "meat", 8: "meat", 9: "soup", 10: "veg",
  11: "meat", 12: "meat", 13: "veg", 14: "veg", 15: "meat",
  16: "meat", 17: "staple", 18: "veg", 19: "meat", 20: "veg",
  21: "other", 22: "meat", 23: "other", 24: "soup", 25: "veg",
  26: "meat", 27: "veg", 28: "other", 29: "soup", 30: "fish",
  31: "meat", 32: "meat", 33: "fish", 34: "other", 35: "meat",
  36: "veg", 37: "meat", 38: "meat", 39: "other", 40: "meat",
  41: "veg", 42: "meat", 43: "soup", 44: "veg", 45: "meat",
  46: "meat", 47: "other", 48: "staple", 49: "other", 50: "staple",
};

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
function StatsCalChart({ cal, goal }) {
  const max = Math.max(cal, goal) + 300;
  const W = 300, H = 120, padL = 40, padR = 20, padT = 20, padB = 30;
  const barW = 50;
  const barH = v => ((v / max) * (H - padT - padB));
  const barY = v => H - padB - barH(v);
  const goalY = H - padB - barH(goal);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      <line x1={padL} y1={goalY} x2={W - padR} y2={goalY} stroke={G.amber.mid} strokeWidth={1} strokeDasharray="4,3" />
      <text x={W - padR} y={goalY - 4} fontSize={9} fill={G.amber.mid} textAnchor="end">目标 {goal}</text>
      <rect x={(W - barW) / 2} y={barY(cal)} width={barW} height={barH(cal)}
        fill={cal > goal ? G.red.mid : G.green.mid} rx={4} />
      <text x={W / 2} y={H - padB + 14} textAnchor="middle" fontSize={11} fill={G.gray.mid}>今日</text>
      <text x={W / 2} y={barY(cal) - 6} textAnchor="middle" fontSize={11} fill={cal > goal ? G.red.dark : G.green.dark} fontWeight="500">{cal} 千卡</text>
    </svg>
  );
}

function NutritionRing({ foodLog }) {
  const protein = Math.round(foodLog.reduce((s, f) => s + (f.protein || 0), 0));
  const carb = Math.round(foodLog.reduce((s, f) => s + (f.carb || 0), 0));
  const fat = Math.round(foodLog.reduce((s, f) => s + (f.fat || 0), 0));
  const total = protein + carb + fat || 1;
  const pPct = Math.round(protein / total * 100);
  const cPct = Math.round(carb / total * 100);
  const fPct = 100 - pPct - cPct;
  const r = 50, cx = 70, cy = 70, stroke = 14;
  const circ = 2 * Math.PI * r;
  const pDash = circ * pPct / 100;
  const cDash = circ * cPct / 100;
  const fDash = circ * fPct / 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={140} height={140}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={G.gray.light} strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={G.teal.mid} strokeWidth={stroke}
          strokeDasharray={`${pDash} ${circ - pDash}`} strokeDashoffset={circ * 0.25} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={G.amber.mid} strokeWidth={stroke}
          strokeDasharray={`${cDash} ${circ - cDash}`} strokeDashoffset={circ * 0.25 - pDash} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={G.blue.mid} strokeWidth={stroke}
          strokeDasharray={`${fDash} ${circ - fDash}`} strokeDashoffset={circ * 0.25 - pDash - cDash} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fill={G.gray.dark}>今日</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill={G.gray.dark}>营养</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[["蛋白质", `${protein}g`, `${pPct}%`, G.teal], ["碳水", `${carb}g`, `${cPct}%`, G.amber], ["脂肪", `${fat}g`, `${fPct}%`, G.blue]].map(([label, val, pct, c]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: c.mid }} />
            <span style={{ fontSize: 13, color: G.gray.dark, width: 44 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: c.dark }}>{val}</span>
            <span style={{ fontSize: 11, color: c.mid }}>{pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeightPredictChart({ data }) {
  if (!data.length) return <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 20 }}>暂无数据</div>;
  const vals = data.map(d => d.weight);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const W = 300, H = 120, pad = { l: 36, r: 30, t: 14, b: 28 };
  const totalPts = data.length + 3;
  const x = i => pad.l + i * ((W - pad.l - pad.r) / (totalPts - 1));
  const y = v => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const n = data.length;
  const sumX = data.reduce((s, _, i) => s + i, 0);
  const sumY = data.reduce((s, d) => s + d.weight, 0);
  const sumXY = data.reduce((s, d, i) => s + i * d.weight, 0);
  const sumX2 = data.reduce((s, _, i) => s + i * i, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const predict = i => intercept + slope * i;
  const pts = data.map((d, i) => `${x(i)},${y(d.weight)}`).join(" ");
  const predPts = [n - 1, n, n + 1, n + 2].map(i => `${x(i)},${y(predict(i))}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
      <polyline points={pts} fill="none" stroke={G.teal.mid} strokeWidth={2} strokeLinejoin="round" />
      <polyline points={predPts} fill="none" stroke={G.teal.mid} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7} />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.weight)} r={3} fill={G.teal.mid} />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize={9} fill={G.gray.mid}>{d.day}</text>
        </g>
      ))}
      <text x={x(n + 1)} y={y(predict(n + 1)) - 6} fontSize={9} fill={G.teal.mid}>预测</text>
      {[min + 0.5, min + 1].map((v, i) => (
        <text key={i} x={pad.l - 4} y={y(v) + 4} textAnchor="end" fontSize={9} fill={G.gray.mid}>{v.toFixed(1)}</text>
      ))}
    </svg>
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


function RecipeDetail({ r, onBack, staple, onAdd }) {
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
      <div style={{ background: G.amber.bg, borderRadius: 12, padding: "12px 14px", marginTop: 14, border: `1px solid ${G.amber.light}` }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: G.amber.dark, marginBottom: 6 }}>搭配主食热量</div>
        <div style={{ fontSize: 13, color: G.amber.dark }}>
          {r.name} + {staple.name}（100g）共计：
          <span style={{ fontWeight: 500, fontSize: 16 }}> {r.cal + staple.cal} 千卡</span>
        </div>
        <button onClick={() => onAdd(r, staple)} style={{ width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 10, border: "none", background: G.green.mid, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          + 添加到今日饮食记录
        </button>
      </div>
    </div>
  );
}

{/*登录/注册界面*/}
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
      <div style={{ fontWeight: 500, fontSize: 24, color: G.green.dark, marginBottom: 4 }}> FamilyFit </div>
      <div style={{ fontSize: 13, color: G.green.mid, marginBottom: 32 }}> 家用健康小软件 </div>

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
        <div style={{ fontSize: 11, color: G.green.mid, marginTop: 6, marginBottom: 4 }}>我的昵称</div>
<div style={{ display: "flex", gap: 8 }}>
  <input
    id="nicknameInput"
    defaultValue={localStorage.getItem("hf_nickname") || user.email.split('@')[0]}
    placeholder="设置昵称"
    style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: `0.5px solid ${G.green.light}`, fontSize: 13, outline: "none" }}
  />
  <button onClick={async () => {
    const val = document.getElementById("nicknameInput").value.trim();
    if (!val) return;
    await supabase.from('profiles').upsert({ id: user.id, nickname: val });
    localStorage.setItem("hf_nickname", val);
    alert("昵称已更新！");
  }} style={{ background: G.green.mid, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>保存</button>
</div>
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

{bmi && height && (
  <div style={{ background: G.blue.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.blue.light}` }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: G.blue.dark, marginBottom: 8 }}>健康体重范围</div>
    <div style={{ fontSize: 13, color: G.blue.dark }}>
      根据你的身高 <span style={{ fontWeight: 500 }}>{height}cm</span>，健康体重应在：
    </div>
    <div style={{ fontWeight: 500, fontSize: 22, color: G.blue.dark, margin: "8px 0" }}>
      {(18.5 * Math.pow(parseFloat(height) / 100, 2)).toFixed(1)} kg
      <span style={{ fontSize: 14, fontWeight: 400 }}> ~ </span>
      {(24 * Math.pow(parseFloat(height) / 100, 2)).toFixed(1)} kg
    </div>
    <div style={{ fontSize: 11, color: G.blue.mid }}>BMI 18.5 ~ 24 为健康范围</div>
  </div>
)}
      {tdee && (
        <div style={{ background: G.teal.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.teal.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.teal.dark, marginBottom: 4 }}>每日消耗估算（TDEE）</div>
          <div style={{ fontWeight: 500, fontSize: 28, color: G.teal.dark }}>{tdee} <span style={{ fontSize: 14 }}>千卡/天</span></div>
          <div style={{ fontSize: 12, color: G.teal.mid, marginTop: 4 }}>基于身高体重年龄，适度活动量估算</div>
        </div>
      )}

      <div style={{ background: G.teal.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.teal.light}` }}>
  <div style={{ fontSize: 13, fontWeight: 500, color: G.teal.dark, marginBottom: 10 }}>目标体重设定</div>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <input
      type="number"
      defaultValue={localStorage.getItem("hf_target_weight") || ""}
      id="targetWeightInput"
      placeholder="输入目标体重 (kg)"
      style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${G.teal.light}`, fontSize: 14, outline: "none" }}
    />
    <span style={{ fontSize: 12, color: G.teal.mid }}>kg</span>
    <button onClick={() => {
      const val = document.getElementById("targetWeightInput").value.trim();
      if (!val) return;
      localStorage.setItem("hf_target_weight", val);
      alert("目标体重已保存！");
    }} style={{ background: G.teal.mid, color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>保存</button>
  </div>
  {height && (
    <div style={{ fontSize: 11, color: G.teal.mid, marginTop: 6 }}>
      建议范围：{(18.5 * Math.pow(parseFloat(height) / 100, 2)).toFixed(1)} ~ {(24 * Math.pow(parseFloat(height) / 100, 2)).toFixed(1)} kg
    </div>
  )}
</div>

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
  const [statsTab, setStatsTab] = useState("cal"); 
 
  //const [danceTab, setDanceTab] = useState("today");
  const [danceTasks, setDanceTasks] = useState([]);
  const [danceCheckins, setDanceCheckins] = useState([]);
  const [danceHistory, setDanceHistory] = useState([]);
  const [showAddDance, setShowAddDance] = useState(false);
  const [newDanceTask, setNewDanceTask] = useState({ name: "", reps: "", points: 10 });
  const [danceRole, setDanceRole] = useState("daughter");
  const [totalDancePoints, setTotalDancePoints] = useState(0);
  const [pastTasks, setPastTasks] = useState([]);
 
  const [socialTab, setSocialTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [profile, setProfile] = useState(null);
  useEffect(() => {
  if (!profile) return;

  if (profile.role === "mom") {
    setDanceRole("mom");
  } else {
    setDanceRole("daughter");
  }
}, [profile]);
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
  const [selectedStaple, setSelectedStaple] = useState(STAPLES[0]);
  const [recipeCategory, setRecipeCategory] = useState("all");
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
  if (!user || tab !== "dance") return;

  loadDanceTasks();
  loadDanceHistory();
}, [user, tab, loadDanceTasks, loadDanceHistory]);


useEffect(() => {
  if (!user) return;
  const sub = supabase.channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      if (payload.new.receiver_id === user.id || payload.new.sender_id === user.id) {
        setMessages(prev => [...prev, payload.new]);
      }
    }).subscribe();
  return () => supabase.removeChannel(sub);
}, [user]);

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
      const { data: check } = await supabase
        .from('exercise_logs')
        .select('id')
        .eq('user_id', uid)
        .eq('created_at', today);
      if (!check || check.length === 0) {
        const def = DEFAULT_EXERCISES.map(ex => ({
          ...ex, user_id: uid, created_at: today
        }));
        const { data } = await supabase.from('exercise_logs').insert(def).select();
        if (data) setExercises(data);
      }
    }

    setInitialized(true); {/* ✅ 防止重复执行 */}
    setLoading(false);
  };

  loadAll();
}, [user, initialized]);


async function loadProfile() {
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (data) setProfile(data);
  else {
    const { data: newP } = await supabase.from('profiles').insert([{ id: user.id, nickname: user.email.split('@')[0] }]).select().single();
    if (newP) setProfile(newP);
  }
}

async function loadFriends() {
  const { data } = await supabase.from('friendships')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'accepted');
  if (!data || !data.length) { setFriends([]); return; }

  const friendIds = data.map(f => f.friend_id);
  const { data: profilesData } = await supabase.from('profiles')
    .select('id, nickname, avatar_emoji')
    .in('id', friendIds);

  const merged = data.map(f => {
    const profile = profilesData?.find(p => p.id === f.friend_id);
    return { ...f, friendId: f.friend_id, nickname: profile?.nickname, avatar_emoji: profile?.avatar_emoji };
  });
  setFriends(merged);
}

async function searchAndAddFriend() {
  if (!searchEmail.trim()) return;
  const { data: target } = await supabase.from('profiles')
    .select('id, nickname')
    .eq('nickname', searchEmail.trim())
    .single();
  if (!target) { alert('找不到该用户，请检查昵称'); return; }
  if (target.id === user.id) { alert('不能添加自己'); return; }

  const { data: existing } = await supabase.from('friendships')
    .select('id')
    .eq('user_id', user.id)
    .eq('friend_id', target.id)
    .single();
  if (existing) { alert('已经是好友了'); return; }

  await supabase.from('friendships').insert([
    { user_id: user.id, friend_id: target.id, status: 'accepted' },
    { user_id: target.id, friend_id: user.id, status: 'accepted' },
  ]);
  setSearchEmail("");
  loadFriends();
}

async function loadMessages(friendId) {
  const { data } = await supabase.from('messages')
    .select('*')
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
    .order('created_at');
  if (data) setMessages(data);
}

async function sendMessage() {
  if (!msgInput.trim() || !activeFriend) return;
  await supabase.from('messages').insert([{ sender_id: user.id, receiver_id: activeFriend.friendId, content: msgInput.trim() }]);
  setMsgInput("");
  
}

function getFriendInfo(f) {
  return { friendId: f.friendId, nickname: f.nickname, avatar_emoji: f.avatar_emoji };
}


async function loadDanceTasks() {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('dance_tasks').select('*').eq('task_date', today).order('created_at');
  if (data) setDanceTasks(data);

  const { data: checkins } = await supabase.from('dance_checkins').select('*').eq('user_id', user.id).eq('task_date', today);
  if (checkins) setDanceCheckins(checkins);

  const { data: points } = await supabase.from('dance_points').select('points').eq('user_id', user.id);
  if (points) setTotalDancePoints(points.reduce((s, p) => s + p.points, 0));

  const { data: past } = await supabase.from('dance_tasks').select('name').order('created_at', { ascending: false });
  if (past) setPastTasks([...new Set(past.map(t => t.name))].slice(0, 10));
}

async function loadDanceHistory() {
  const { data } = await supabase.from('dance_checkins').select('task_date, task_id').eq('user_id', user.id).order('task_date', { ascending: false });
  if (!data) return;
  const byDate = {};
  data.forEach(c => {
    if (!byDate[c.task_date]) byDate[c.task_date] = 0;
    byDate[c.task_date]++;
  });
  setDanceHistory(Object.entries(byDate).slice(0, 7).map(([date, count]) => ({ date, count })));
}

async function toggleDanceTask(task) {
  const today = new Date().toISOString().split('T')[0];
  const existing = danceCheckins.find(c => c.task_id === task.id);
  if (existing) {
    await supabase.from('dance_checkins').delete().eq('id', existing.id);
    setDanceCheckins(prev => prev.filter(c => c.id !== existing.id));
    setTotalDancePoints(prev => prev - task.points);
  } else {
    const { data } = await supabase.from('dance_checkins').insert([{ task_id: task.id, user_id: user.id, task_date: today }]).select();
    if (data) {
      setDanceCheckins(prev => [...prev, ...data]);
      await supabase.from('dance_points').insert([{ user_id: user.id, points: task.points, reason: task.name }]);
      setTotalDancePoints(prev => prev + task.points);
    }
  }
}

async function addDanceTask() {
  if (!newDanceTask.name || !newDanceTask.reps) return;
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('dance_tasks').insert([{
    name: newDanceTask.name, reps: newDanceTask.reps,
    points: parseInt(newDanceTask.points) || 10,
    created_by: user.id, task_date: today
  }]).select();
  if (data) setDanceTasks(prev => [...prev, ...data]);
  setNewDanceTask({ name: "", reps: "", points: 10 });
  setShowAddDance(false);
}

async function deleteDanceTask(id) {
  await supabase.from('dance_tasks').delete().eq('id', id);
  setDanceTasks(prev => prev.filter(t => t.id !== id));
}


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
  
  const tabs = [
    { id: "home", icon: "🏠", label: "首页" },
    { id: "diet", icon: "🥗", label: "饮食" },
    { id: "weight", icon: "⚖️", label: "体重" },
    { id: "exercise", icon: "🏃", label: "运动" },
    { id: "dance", icon: "💃", label: "舞蹈" },
    { id: "social", icon: "👥", label: "社交" },
    { id: "profile", icon: "👤", label: "我的" },
    { id: "stats", icon: "📊", label: "统计" },
  ];

  if (authLoading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12 }}>
      <div style={{ fontSize: 40 }}>🌿</div>
      <div style={{ color: G.green.mid, fontSize: 14 }}>FamilyFit 启动中...</div>
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
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "sans-serif", paddingBottom: 120 }}>
      <div style={{ background: G.green.mid, padding: "18px 20px 14px", borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontSize: 11, opacity: 0.85 }}>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div style={{ color: "#fff", fontWeight: 500, fontSize: 20, marginTop: 2 }}>FamilyFit 🌿</div>
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
    <div style={{ fontSize: 13, color: G.gray.mid, marginBottom: 10 }}>🍜 50道中餐经典 · 卡路里参考</div>

    {/* 搜索框 */}
    <div style={{ position: "relative", marginBottom: 14 }}>
      <input value={recipeSearch} onChange={e => setRecipeSearch(e.target.value)} placeholder="搜索食谱..." style={{ width: "100%", padding: "10px 14px", borderRadius: 22, border: `0.5px solid ${G.green.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
      {recipeSearch && (
        <div style={{ position: "absolute", top: 44, left: 0, right: 0, background: "#fff", borderRadius: 12, border: `0.5px solid ${G.gray.light}`, zIndex: 10 }}>
          {RECIPES.filter(r => r.name.includes(recipeSearch)).map(r => (
            <div key={r.id} onClick={() => { setSelectedRecipe(r); setRecipeSearch(""); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: `0.5px solid ${G.gray.bg}`, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{r.emoji}</span>
                <span style={{ fontSize: 14 }}>{r.name}</span>
              </div>
              <span style={{ fontSize: 12, color: G.amber.mid }}>{r.cal}千卡</span>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* 主食选择 */}
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>主食选择 <span style={{ fontSize: 11, color: G.gray.mid, fontWeight: 400 }}>（每100g）</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {STAPLES.map(s => (
          <button key={s.name} onClick={() => setSelectedStaple(s)} style={{ padding: "8px 4px", borderRadius: 10, border: `0.5px solid ${selectedStaple?.name === s.name ? G.teal.mid : G.gray.light}`, background: selectedStaple?.name === s.name ? G.teal.bg : "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 11, color: selectedStaple?.name === s.name ? G.teal.dark : G.gray.dark }}>{s.name}</span>
            <span style={{ fontSize: 10, color: G.teal.mid }}>{s.cal}千卡</span>
          </button>
        ))}
      </div>
    </div>

    {/* TOP 10 */}
  {/* 分类选择 */}
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>菜品分类</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setRecipeCategory(c.id)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${recipeCategory === c.id ? G.green.mid : G.gray.light}`, background: recipeCategory === c.id ? G.green.mid : "#fff", color: recipeCategory === c.id ? "#fff" : G.gray.dark, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14 }}>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* 菜品列表 */}
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>
        {CATEGORIES.find(c => c.id === recipeCategory)?.emoji} {CATEGORIES.find(c => c.id === recipeCategory)?.label}
        <span style={{ fontSize: 11, color: G.gray.mid, fontWeight: 400, marginLeft: 6 }}>
          共 {RECIPES.filter(r => recipeCategory === "all" || RECIPE_CATEGORY[r.id] === recipeCategory).length} 道
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {RECIPES.filter(r => recipeCategory === "all" || RECIPE_CATEGORY[r.id] === recipeCategory).map((r, i) => (
          <div key={r.id} onClick={() => setSelectedRecipe(r)} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "10px 12px", cursor: "pointer", border: `0.5px solid ${G.gray.light}` }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: i < 3 && recipeCategory === "all" ? G.amber.mid : G.gray.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: i < 3 && recipeCategory === "all" ? "#fff" : G.gray.mid, fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 20 }}>{r.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: G.gray.dark }}>{r.name}</div>
            </div>
            <span style={{ fontSize: 11, background: G.green.bg, color: G.green.dark, padding: "2px 8px", borderRadius: 20 }}>{r.tag}</span>
            <span style={{ fontSize: 13, color: G.amber.mid, fontWeight: 500 }}>{r.cal}千卡</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
            {dietSub === "recipes" && selectedRecipe && (
  <RecipeDetail
    r={selectedRecipe}
    onBack={() => setSelectedRecipe(null)}
    staple={selectedStaple}
    onAdd={(dish, staple) => {
      addFood({ name: `${dish.name}+${staple.name}`, cal: dish.cal + staple.cal });
      setSelectedRecipe(null);
      setDietSub("record");
    }}
  />
)}
          </div>
        )}

        {tab === "weight" && (
          <div>
            <div style={{ background: G.teal.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 14, border: `1px solid ${G.teal.light}` }}>
              <div style={{ fontSize: 13, color: G.teal.mid, marginBottom: 4 }}>当前体重</div>
              <div style={{ fontWeight: 500, fontSize: 32, color: G.teal.dark }}>{curW} <span style={{ fontSize: 16 }}>kg</span></div>
              <div style={{ fontSize: 12, color: G.teal.mid }}>
  目标体重 {localStorage.getItem("hf_target_weight") || "未设定"} kg
  {localStorage.getItem("hf_target_weight") && weights.length ? 
    ` · 还差 ${(parseFloat(curW) - parseFloat(localStorage.getItem("hf_target_weight"))).toFixed(1)} kg` : ""}
</div>
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

{tab === "dance" && (
  <div>
    {/* 角色标题 */}
<div style={{ background: profile?.role === "mom" ? G.teal.bg : G.pink.bg, borderRadius: 12, padding: "10px 14px", marginBottom: 14, border: `1px solid ${profile?.role === "mom" ? G.teal.light : G.pink.light}` }}>
  <div style={{ fontSize: 13, fontWeight: 500, color: profile?.role === "mom" ? G.teal.dark : G.pink.dark }}>
    {profile?.role === "mom" ? "👩 妈妈管理台" : "👧 女儿打卡"}
  </div>
</div>

    {/* 女儿打卡视图 */}
    {danceRole === "daughter" && (
      <div>
        {/* 积分头部 */}
        <div style={{ background: `linear-gradient(135deg, ${G.pink.mid}, ${G.purple.mid})`, borderRadius: 14, padding: "16px", marginBottom: 14, color: "#fff" }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>累计积分</div>
          <div style={{ fontWeight: 500, fontSize: 32, marginTop: 2 }}>⭐ {totalDancePoints}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "4px 12px", fontSize: 12 }}>
              今日完成 {danceCheckins.length}/{danceTasks.length}
            </div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "4px 12px", fontSize: 12 }}>
              今日 +{danceCheckins.reduce((s, c) => { const t = danceTasks.find(t => t.id === c.task_id); return s + (t?.points || 0); }, 0)} 分
            </div>
          </div>
        </div>

        {/* 进度条 */}
        {danceTasks.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 8, background: "#E0E0E0", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${danceCheckins.length / danceTasks.length * 100}%`, background: `linear-gradient(to right, ${G.pink.mid}, ${G.purple.mid})`, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
            {danceCheckins.length === danceTasks.length && danceTasks.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 14, color: G.green.dark, fontWeight: 500 }}>🎉 太棒了！今日训练全部完成！</div>
            )}
          </div>
        )}

        {/* 任务列表 */}
        <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>今日训练任务</div>
        {danceTasks.length === 0 && (
          <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 30 }}>今日还没有训练任务，等妈妈发布 💃</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {danceTasks.map(t => {
            const done = danceCheckins.some(c => c.task_id === t.id);
            return (
              <div key={t.id} onClick={() => toggleDanceTask(t)} style={{ display: "flex", alignItems: "center", gap: 12, background: done ? G.pink.bg : "#fff", borderRadius: 12, padding: "12px 14px", cursor: "pointer", border: `1px solid ${done ? G.pink.light : G.gray.light}` }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, border: `2px solid ${done ? G.pink.mid : G.gray.light}`, background: done ? G.pink.mid : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", flexShrink: 0 }}>
                  {done ? "✓" : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: done ? G.pink.dark : G.gray.dark }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: G.gray.mid }}>{t.reps}</div>
                </div>
                <div style={{ background: G.amber.bg, borderRadius: 12, padding: "3px 8px", fontSize: 11, color: G.amber.dark, fontWeight: 500 }}>+{t.points}分</div>
              </div>
            );
          })}
        </div>

        {/* 历史记录 */}
        {danceHistory.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>近期打卡记录</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {danceHistory.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 10, padding: "10px 12px", border: `0.5px solid ${G.gray.light}` }}>
                  <div style={{ fontSize: 12, color: G.gray.mid, width: 70 }}>{h.date}</div>
                  <div style={{ flex: 1, height: 6, background: "#E0E0E0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, h.count / Math.max(...danceHistory.map(d => d.count)) * 100)}%`, background: G.pink.mid, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: G.pink.mid }}>{h.count} 项</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {/* 妈妈管理视图 */}
    {danceRole === "mom" && (
      <div>
        {/* 添加任务 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark }}>今日训练任务管理</div>
          <button onClick={() => setShowAddDance(!showAddDance)} style={{ background: G.teal.mid, color: "#fff", border: "none", borderRadius: 16, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>+ 添加</button>
        </div>

        {showAddDance && (
          <div style={{ background: G.teal.bg, borderRadius: 12, padding: 14, marginBottom: 12, border: `1px solid ${G.teal.light}` }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: G.teal.dark, marginBottom: 10 }}>添加训练动作</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>动作名称</div>
              <input value={newDanceTask.name} onChange={e => setNewDanceTask({ ...newDanceTask, name: e.target.value })} placeholder="如：压腿拉伸" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.teal.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>次数/组数</div>
              <input value={newDanceTask.reps} onChange={e => setNewDanceTask({ ...newDanceTask, reps: e.target.value })} placeholder="如：每腿 3×30秒" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.teal.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 4 }}>积分奖励</div>
              <input type="number" value={newDanceTask.points} onChange={e => setNewDanceTask({ ...newDanceTask, points: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${G.teal.light}`, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
            </div>

            {pastTasks.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 6 }}>快速选择历史动作</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {pastTasks.map(name => (
                    <button key={name} onClick={() => setNewDanceTask({ ...newDanceTask, name })} style={{ background: "#fff", border: `0.5px solid ${G.teal.light}`, borderRadius: 16, padding: "4px 10px", fontSize: 11, color: G.teal.dark, cursor: "pointer" }}>{name}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddDance(false)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `0.5px solid ${G.gray.light}`, background: "#fff", color: G.gray.mid, fontSize: 13, cursor: "pointer" }}>取消</button>
              <button onClick={addDanceTask} style={{ flex: 2, padding: "8px 0", borderRadius: 8, border: "none", background: G.teal.mid, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>确认发布</button>
            </div>
          </div>
        )}

        {/* 任务列表 */}
        {danceTasks.length === 0 && (
          <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 30 }}>还没有今日任务，点击添加 👆</div>
        )}
        {danceTasks.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 8, border: `0.5px solid ${G.gray.light}` }}>
            <span style={{ fontSize: 20 }}>💃</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: G.gray.dark }}>{t.name}</div>
              <div style={{ fontSize: 12, color: G.gray.mid }}>{t.reps}</div>
            </div>
            <span style={{ fontSize: 11, background: G.amber.bg, color: G.amber.dark, padding: "2px 8px", borderRadius: 12 }}>+{t.points}分</span>
            <button onClick={() => deleteDanceTask(t.id)} style={{ background: "none", border: "none", color: G.gray.mid, fontSize: 18, cursor: "pointer" }}>×</button>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {tab === "social" && (
  <div>
    {/* 子标签 */}
    <div style={{ display: "flex", gap: 6, marginBottom: 14, background: G.gray.bg, borderRadius: 12, padding: 4 }}>
      {[["friends", "👥 好友"], ["chat", "💬 聊天"]].map(([id, label]) => (
        <button key={id} onClick={() => setSocialTab(id)} style={{ flex: 1, padding: "7px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: socialTab === id ? "#fff" : "transparent", color: socialTab === id ? G.green.dark : G.gray.mid }}>
          {label}
        </button>
      ))}
    </div>

    {socialTab === "friends" && (
      <div>
        {/* 我的资料 */}
        {profile && (
          <div style={{ background: G.green.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${G.green.light}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: G.green.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{profile.avatar_emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 15, color: G.green.dark }}>{profile.nickname}</div>
              <div style={{ fontSize: 11, color: G.green.mid }}>我的昵称（好友搜索用）</div>
            </div>
          </div>
        )}

        {/* 搜索添加好友 */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `0.5px solid ${G.gray.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>添加好友</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={searchEmail} onChange={e => setSearchEmail(e.target.value)} placeholder="输入对方昵称..." style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: `0.5px solid ${G.green.light}`, fontSize: 13, outline: "none" }} onKeyDown={e => e.key === "Enter" && searchAndAddFriend()} />
            <button onClick={searchAndAddFriend} style={{ background: G.green.mid, color: "#fff", border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>添加</button>
          </div>
        </div>

        {/* 好友列表 */}
        <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 8 }}>好友列表 ({friends.length})</div>
        {friends.length === 0 && (
          <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 30 }}>还没有好友，搜索昵称添加吧 👋</div>
        )}
        {friends.map((f, i) => {
          const info = getFriendInfo(f);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: `0.5px solid ${G.gray.light}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: G.teal.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{info.avatar_emoji || "🙂"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, color: G.gray.dark }}>{info.nickname || "用户"}</div>
              </div>
              <button onClick={() => { setActiveFriend(info); setSocialTab("chat"); loadMessages(info.friendId); }} style={{ background: G.teal.bg, color: G.teal.dark, border: `0.5px solid ${G.teal.light}`, borderRadius: 16, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>发消息</button>
            </div>
          );
        })}
      </div>
    )}

    {socialTab === "chat" && (
      <div>
        {!activeFriend ? (
          <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 40 }}>请先在好友列表选择好友发消息</div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, background: G.teal.bg, borderRadius: 12, padding: "10px 14px", border: `1px solid ${G.teal.light}` }}>
              <div style={{ fontSize: 22 }}>{activeFriend.avatar_emoji || "🙂"}</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: G.teal.dark }}>{activeFriend.nickname || "好友"}</div>
              <button onClick={() => setActiveFriend(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: G.gray.mid, fontSize: 18, cursor: "pointer" }}>×</button>
            </div>

            {/* 消息列表 */}
            <div style={{ minHeight: 300, maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: G.gray.mid, fontSize: 13, padding: 30 }}>还没有消息，说点什么吧 👋</div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.sender_id === user.id ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "75%", background: m.sender_id === user.id ? G.green.mid : "#fff", color: m.sender_id === user.id ? "#fff" : G.gray.dark, borderRadius: m.sender_id === user.id ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, border: m.sender_id !== user.id ? `0.5px solid ${G.gray.light}` : "none" }}>
                    <div>{m.content}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" }}>{new Date(m.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div style={{ display: "flex", gap: 8 }}>
              <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="输入消息..." style={{ flex: 1, padding: "10px 14px", borderRadius: 22, border: `0.5px solid ${G.green.light}`, fontSize: 14, outline: "none" }} />
              <button onClick={sendMessage} style={{ background: G.green.mid, color: "#fff", border: "none", borderRadius: 22, padding: "0 18px", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>发送</button>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
)}
        {tab === "stats" && (
  <div>
    {/* 子标签 */}
    <div style={{ display: "flex", gap: 6, marginBottom: 14, background: G.gray.bg, borderRadius: 12, padding: 4 }}>
      {[["cal", "🔥 热量"], ["nutrition", "🥗 营养素"], ["weight", "⚖️ 体重"]].map(([id, label]) => (
        <button key={id} onClick={() => setStatsTab(id)} style={{ flex: 1, padding: "7px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: statsTab === id ? "#fff" : "transparent", color: statsTab === id ? G.green.dark : G.gray.mid }}>
          {label}
        </button>
      ))}
    </div>

    {statsTab === "cal" && (
      <div>
        <div style={{ background: G.green.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${G.green.light}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: G.green.mid, marginBottom: 4 }}>本周日均热量</div>
          <div style={{ fontWeight: 500, fontSize: 28, color: G.green.dark }}>
            {foodLog.length ? Math.round(totalCal) : "--"} <span style={{ fontSize: 14 }}>千卡</span>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: `0.5px solid ${G.gray.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 4 }}>今日热量</div>
          <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 8 }}>绿色=达标 红色=超标 虚线=目标</div>
          <StatsCalChart goal={parseInt(localStorage.getItem("hf_goal") || "1800")} cal={totalCal} />
        </div>
      </div>
    )}

    {statsTab === "nutrition" && (
      <div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px", marginBottom: 14, border: `0.5px solid ${G.gray.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 12 }}>今日营养素分布</div>
          <NutritionRing foodLog={foodLog} />
        </div>
        <div style={{ background: G.green.bg, borderRadius: 12, padding: "14px", border: `1px solid ${G.green.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.green.dark, marginBottom: 10 }}>营养素建议摄入</div>
          {[
            { label: "蛋白质", current: foodLog.reduce((s, f) => s + (f.protein || 0), 0), target: 100, color: G.teal },
            { label: "碳水", current: foodLog.reduce((s, f) => s + (f.carb || 0), 0), target: 200, color: G.amber },
            { label: "脂肪", current: foodLog.reduce((s, f) => s + (f.fat || 0), 0), target: 60, color: G.blue },
          ].map(n => (
            <div key={n.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: G.gray.dark }}>{n.label}</span>
                <span style={{ color: n.color.mid }}>{n.current}g / {n.target}g</span>
              </div>
              <div style={{ height: 6, background: "#E0E0E0", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, n.current / n.target * 100)}%`, background: n.current > n.target ? G.red.mid : n.color.mid, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {statsTab === "weight" && (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "当前体重", val: `${curW}kg`, color: G.teal },
            { label: "距目标", val: localStorage.getItem("hf_target_weight") && weights.length ? `${(parseFloat(curW) - parseFloat(localStorage.getItem("hf_target_weight"))).toFixed(1)}kg` : "--", color: G.green },
          ].map(c => (
            <div key={c.label} style={{ background: c.color.bg, borderRadius: 12, padding: "14px", border: `1px solid ${c.color.light}`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: c.color.mid, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontWeight: 500, fontSize: 22, color: c.color.dark }}>{c.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: `0.5px solid ${G.teal.light}` }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: G.gray.dark, marginBottom: 4 }}>体重趋势与预测</div>
          <div style={{ fontSize: 11, color: G.gray.mid, marginBottom: 8 }}>实线=实际 虚线=预测走势</div>
          <WeightPredictChart data={weights} />
        </div>
      </div>
    )}
  </div>
)}
        {tab === "profile" && (
        <ProfileTab user={user} onSignOut={signOut} />
       )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#fff", borderTop: `0.5px solid ${G.gray.light}`, display: "flex", zIndex: 100 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "social") { loadFriends(); loadProfile(); } }} style={{ flex: 1, padding: "10px 0 8px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, color: tab === t.id ? G.green.mid : G.gray.mid, fontWeight: tab === t.id ? 500 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}