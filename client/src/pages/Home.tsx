import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChefHat, Refrigerator, Plus, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import recipesData from "@/data/recipes.json";

// 食材カテゴリとアイコン
const INGREDIENT_CATEGORIES = [
  { id: "meat", name: "お肉", icon: "🍖", items: ["鶏もも肉", "豚肉", "牛肉", "ウインナー", "ベーコン"] },
  { id: "fish", name: "お魚", icon: "🐟", items: ["サバ缶", "ツナ缶", "さんま", "えび"] },
  { id: "vegetable", name: "お野菜", icon: "🥕", items: ["玉ねぎ", "にんじん", "じゃがいも", "しめじ", "トマト", "ピーマン", "キャベツ", "ほうれん草", "もやし", "コーン", "大根", "長ネギ"] },
  { id: "other", name: "その他", icon: "🥚", items: ["卵", "チーズ", "豆腐", "バター", "米", "昆布", "栗"] }
];

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 食材の選択切り替え
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  // レシピ検索ロジック
  const allMatchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    return recipesData.map(recipe => {
      // レシピに必要な食材のうち、選択された食材が含まれている数
      const matchCount = recipe.ingredients.filter(i => 
        selectedIngredients.some(s => i.includes(s) || s.includes(i))
      ).length;
      
      // 不足している食材
      const missingIngredients = recipe.ingredients.filter(i => 
        !selectedIngredients.some(s => i.includes(s) || s.includes(i)) && 
        !["米", "水", "調味料", "塩", "こしょう", "醤油", "砂糖", "酒", "みりん", "油"].some(basic => i.includes(basic))
      );

      return {
        ...recipe,
        matchCount,
        missingIngredients,
        matchRate: matchCount / recipe.ingredients.length
      };
    })
    .filter(r => r.matchCount > 0) // 少なくとも1つは食材が一致するもの
    .sort((a, b) => {
      // クックパッド以外を優先
      const aIsCookpad = a.source === "クックパッド";
      const bIsCookpad = b.source === "クックパッド";
      if (aIsCookpad !== bIsCookpad) {
        return aIsCookpad ? 1 : -1;
      }
      // 同じ出典の場合は、不足食材が少ない順、一致数が多い順
      if (a.missingIngredients.length !== b.missingIngredients.length) {
        return a.missingIngredients.length - b.missingIngredients.length;
      }
      return b.matchCount - a.matchCount;
    });
  }, [selectedIngredients]);

  // ご飯を使わないレシピと使うレシピに分割
  const recipesWithoutRice = useMemo(() => {
    return allMatchedRecipes.filter(r => !r.ingredients.some(i => i.includes("米")));
  }, [allMatchedRecipes]);

  const recipesWithRice = useMemo(() => {
    return allMatchedRecipes.filter(r => r.ingredients.some(i => i.includes("米")));
  }, [allMatchedRecipes]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_var(--background)_0%,_oklch(0.95_0.02_45)_100%)] pb-20">
      {/* ヘッダー */}
      <header className="pt-12 pb-8 text-center px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <ChefHat className="w-10 h-10 text-primary mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-['Kiwi_Maru']">
              炊飯器レシピファインダー
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mt-2 font-medium">
            冷蔵庫にあるものを教えてね！おいしいご飯を提案するよ🍚
          </p>
        </motion.div>
      </header>

      <main className="container max-w-4xl mx-auto px-4">
        {/* 食材選択エリア */}
        <section className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_16px_oklch(0.9_0.02_45),-8px_-8px_16px_oklch(1_0_0)] border border-white/50">
            <div className="flex items-center mb-6">
              <Refrigerator className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-bold text-foreground font-['Kiwi_Maru']">冷蔵庫になにがある？</h2>
            </div>

            <div className="space-y-8">
              {INGREDIENT_CATEGORIES.map(category => (
                <div key={category.id}>
                  <h3 className="text-lg font-bold text-muted-foreground mb-3 flex items-center">
                    <span className="mr-2 text-2xl">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {category.items.map(item => (
                      <motion.button
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleIngredient(item)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                          ${selectedIngredients.includes(item)
                            ? "bg-primary text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]"
                            : "bg-white text-foreground shadow-[3px_3px_6px_oklch(0.9_0.02_45),-3px_-3px_6px_oklch(1_0_0)] hover:shadow-[5px_5px_10px_oklch(0.9_0.02_45),-5px_-5px_10px_oklch(1_0_0)]"
                          }
                        `}
                      >
                        {item}
                        {selectedIngredients.includes(item) && <span className="ml-1">✓</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 検索ボタン */}
            <div className="mt-10 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResults(true)}
                disabled={selectedIngredients.length === 0}
                className={`
                  px-8 py-4 rounded-full text-xl font-bold flex items-center justify-center mx-auto
                  ${selectedIngredients.length > 0
                    ? "bg-primary text-white shadow-[5px_5px_15px_oklch(0.75_0.15_45/0.4)] cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                <Search className="w-6 h-6 mr-2" />
                レシピをさがす
              </motion.button>
              {selectedIngredients.length > 0 && (
                <p className="text-sm text-muted-foreground mt-3">
                  {allMatchedRecipes.length}件のレシピが見つかりました
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 検索結果エリア */}
        <AnimatePresence>
          {showResults && selectedIngredients.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="space-y-10"
            >
              {allMatchedRecipes.length === 0 ? (
                <div className="text-center p-10 bg-white/50 rounded-3xl">
                  <p className="text-xl text-muted-foreground">
                    ごめんね、その食材だけだとレシピが見つからなかったよ...<br/>
                    他の食材も選んでみてね！
                  </p>
                </div>
              ) : (
                <>
                  {/* ご飯を使わないレシピセクション */}
                  {recipesWithoutRice.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-accent font-['Kiwi_Maru']">
                          🍲 ご飯なしレシピ ({recipesWithoutRice.length}件)
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipesWithoutRice.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden border-none shadow-[8px_8px_16px_oklch(0.9_0.02_45),-8px_-8px_16px_oklch(1_0_0)] rounded-[2rem] bg-white hover:translate-y-[-5px] transition-transform duration-300">
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                          {/* 画像プレースホルダー - 実際には画像URLを使用 */}
                          <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 text-secondary-foreground">
                            <span className="text-4xl">🥘</span>
                          </div>
                          {/* 実際の画像があれば表示 */}
                          {/* <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" /> */}
                          
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-primary hover:bg-white shadow-sm backdrop-blur-sm">
                              {recipe.cookingTime}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="mb-2 border-primary/30 text-primary bg-primary/5">
                              {recipe.source}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl font-bold leading-tight font-['Kiwi_Maru']">
                            {recipe.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1 mb-2">
                              {recipe.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 不足食材の提案 */}
                          {recipe.missingIngredients.length > 0 ? (
                            <div className="bg-orange-50 p-3 rounded-xl mb-4 border border-orange-100">
                              <p className="text-sm font-bold text-orange-600 flex items-center mb-1">
                                <Plus className="w-4 h-4 mr-1" />
                                あとこれがあれば作れるよ！
                              </p>
                              <p className="text-sm text-orange-800">
                                {recipe.missingIngredients.join("、")}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
                              <p className="text-sm font-bold text-green-600 flex items-center">
                                <Sparkles className="w-4 h-4 mr-1" />
                                今ある材料で作れるよ！
                              </p>
                            </div>
                          )}

                          <Button 
                            className="w-full rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                            onClick={() => window.open(recipe.url, '_blank')}
                          >
                            作り方を見る <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                      </div>
                    </div>
                  )}

                  {/* ご飯を使うレシピセクション */}
                  {recipesWithRice.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-primary font-['Kiwi_Maru']">
                          🍚 ご飯を使ったレシピ ({recipesWithRice.length}件)
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipesWithRice.map((recipe, index) => (
                          <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (recipesWithoutRice.length + index) * 0.1 }}
                          >
                            <Card className="h-full overflow-hidden border-none shadow-[8px_8px_16px_oklch(0.9_0.02_45),-8px_-8px_16px_oklch(1_0_0)] rounded-[2rem] bg-white hover:translate-y-[-5px] transition-transform duration-300">
                              <div className="relative h-48 bg-gray-200 overflow-hidden">
                                {/* 画像プレースホルダー - 実際には画像URLを使用 */}
                                <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 text-secondary-foreground">
                                  <span className="text-4xl">🍚</span>
                                </div>
                                {/* 実際の画像があれば表示 */}
                                {/* <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" /> */}
                                
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-white/90 text-primary hover:bg-white shadow-sm backdrop-blur-sm">
                                    {recipe.cookingTime}
                                  </Badge>
                                </div>
                              </div>
                              
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <Badge variant="outline" className="mb-2 border-primary/30 text-primary bg-primary/5">
                                    {recipe.source}
                                  </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold leading-tight font-['Kiwi_Maru']">
                                  {recipe.title}
                                </CardTitle>
                              </CardHeader>
                              
                              <CardContent>
                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {recipe.tags.map(tag => (
                                      <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* 不足食材の提案 */}
                                {recipe.missingIngredients.length > 0 ? (
                                  <div className="bg-orange-50 p-3 rounded-xl mb-4 border border-orange-100">
                                    <p className="text-sm font-bold text-orange-600 flex items-center mb-1">
                                      <Plus className="w-4 h-4 mr-1" />
                                      あとこれがあれば作れるよ！
                                    </p>
                                    <p className="text-sm text-orange-800">
                                      {recipe.missingIngredients.join("、")}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
                                    <p className="text-sm font-bold text-green-600 flex items-center">
                                      <Sparkles className="w-4 h-4 mr-1" />
                                      今ある材料で作れるよ！
                                    </p>
                                  </div>
                                )}

                                <Button 
                                  className="w-full rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                                  onClick={() => window.open(recipe.url, '_blank')}
                                >
                                  作り方を見る <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
