-- Insert comprehensive translations for all customer-facing text
-- Navigation translations
INSERT INTO public.translations (key, locale, value) VALUES
-- Navigation
('home', 'fr', 'Accueil'),
('home', 'en', 'Home'),
('home', 'ar', 'الرئيسية'),
('home', 'ar-MA', 'الداار'),

('products', 'fr', 'Produits'),
('products', 'en', 'Products'),
('products', 'ar', 'المنتجات'),
('products', 'ar-MA', 'المنتوجات'),

('artisans', 'fr', 'Artisans'),
('artisans', 'en', 'Artisans'),
('artisans', 'ar', 'الحرفيون'),
('artisans', 'ar-MA', 'الصناع التقليديين'),

('categories', 'fr', 'Catégories'),
('categories', 'en', 'Categories'),
('categories', 'ar', 'الفئات'),
('categories', 'ar-MA', 'الأصناف'),

('about', 'fr', 'À propos'),
('about', 'en', 'About'),
('about', 'ar', 'حولنا'),
('about', 'ar-MA', 'علينا'),

('contact', 'fr', 'Contact'),
('contact', 'en', 'Contact'),
('contact', 'ar', 'اتصل بنا'),
('contact', 'ar-MA', 'اتصل بنا'),

('blog', 'fr', 'Blog'),
('blog', 'en', 'Blog'),
('blog', 'ar', 'المدونة'),
('blog', 'ar-MA', 'البلوغ'),

('cart', 'fr', 'Panier'),
('cart', 'en', 'Cart'),
('cart', 'ar', 'السلة'),
('cart', 'ar-MA', 'السلة'),

('favorites', 'fr', 'Favoris'),
('favorites', 'en', 'Favorites'),
('favorites', 'ar', 'المفضلة'),
('favorites', 'ar-MA', 'المفضلة'),

('login', 'fr', 'Connexion'),
('login', 'en', 'Login'),
('login', 'ar', 'تسجيل الدخول'),
('login', 'ar-MA', 'دخول'),

('register', 'fr', 'S''inscrire'),
('register', 'en', 'Register'),
('register', 'ar', 'إنشاء حساب'),
('register', 'ar-MA', 'تسجيل'),

('search', 'fr', 'Rechercher'),
('search', 'en', 'Search'),
('search', 'ar', 'البحث'),
('search', 'ar-MA', 'البحث'),

-- Hero and main content
('discover_authentic_crafts', 'fr', 'Découvrez l''artisanat authentique du Maroc'),
('discover_authentic_crafts', 'en', 'Discover authentic Moroccan crafts'),
('discover_authentic_crafts', 'ar', 'اكتشف الحرف اليدوية المغربية الأصيلة'),
('discover_authentic_crafts', 'ar-MA', 'اكتشف الحرف التقليدية المغربية الأصيلة'),

('unique_handmade_products', 'fr', 'Des produits uniques, faits à la main par des artisans talentueux'),
('unique_handmade_products', 'en', 'Unique handmade products by talented artisans'),
('unique_handmade_products', 'ar', 'منتجات يدوية فريدة من صنع حرفيين موهوبين'),
('unique_handmade_products', 'ar-MA', 'منتوجات يدوية مميزة من صنع صناع ماهرين'),

('explore_collection', 'fr', 'Découvrez notre sélection de produits artisanaux marocains, chaque pièce raconte une histoire unique de savoir-faire traditionnel'),
('explore_collection', 'en', 'Discover our selection of Moroccan handicrafts, each piece tells a unique story of traditional craftsmanship'),
('explore_collection', 'ar', 'اكتشف مجموعتنا من المنتجات الحرفية المغربية، كل قطعة تحكي قصة فريدة من الحرفية التقليدية'),
('explore_collection', 'ar-MA', 'اكتشف مجموعتنا ديال المنتوجات الحرفية المغربية، كل قطعة كتحكي قصة مميزة ديال الصنعة التقليدية'),

('browse_by_category', 'fr', 'Catégories'),
('browse_by_category', 'en', 'Categories'),
('browse_by_category', 'ar', 'تصفح حسب الفئة'),
('browse_by_category', 'ar-MA', 'تصفح حسب الصنف'),

('our_artisans', 'fr', 'Nos Artisans'),
('our_artisans', 'en', 'Our Artisans'),
('our_artisans', 'ar', 'حرفيونا'),
('our_artisans', 'ar-MA', 'الصناع ديالنا'),

('discover_artisans', 'fr', 'Découvrez les talentueux artisans derrière nos créations uniques'),
('discover_artisans', 'en', 'Discover the talented artisans behind our unique creations'),
('discover_artisans', 'ar', 'اكتشف الحرفيين الموهوبين وراء إبداعاتنا الفريدة'),
('discover_artisans', 'ar-MA', 'اكتشف الصناع الماهرين لي كيصنعو الإبداعات ديالنا'),

('all_artisans', 'fr', 'Tous nos artisans'),
('all_artisans', 'en', 'All our artisans'),
('all_artisans', 'ar', 'جميع حرفيينا'),
('all_artisans', 'ar-MA', 'جميع الصناع ديالنا'),

-- Search and filters
('search_products', 'fr', 'Rechercher des produits...'),
('search_products', 'en', 'Search products...'),
('search_products', 'ar', 'البحث عن المنتجات...'),
('search_products', 'ar-MA', 'قلب على المنتوجات...'),

('all_categories', 'fr', 'Toutes les catégories'),
('all_categories', 'en', 'All categories'),
('all_categories', 'ar', 'جميع الفئات'),
('all_categories', 'ar-MA', 'جميع الأصناف'),

('filters', 'fr', 'Filtres'),
('filters', 'en', 'Filters'),
('filters', 'ar', 'المرشحات'),
('filters', 'ar-MA', 'الفلاتر'),

('price_range', 'fr', 'Gamme de prix'),
('price_range', 'en', 'Price range'),
('price_range', 'ar', 'نطاق السعر'),
('price_range', 'ar-MA', 'مجال الثمن'),

('sort_by', 'fr', 'Trier par'),
('sort_by', 'en', 'Sort by'),
('sort_by', 'ar', 'ترتيب حسب'),
('sort_by', 'ar-MA', 'ترتيب حسب'),

('relevance', 'fr', 'Pertinence'),
('relevance', 'en', 'Relevance'),
('relevance', 'ar', 'الصلة'),
('relevance', 'ar-MA', 'الصلة'),

('price_low_high', 'fr', 'Prix croissant'),
('price_low_high', 'en', 'Price: Low to High'),
('price_low_high', 'ar', 'السعر: من الأقل إلى الأعلى'),
('price_low_high', 'ar-MA', 'الثمن: من الرخيص للغالي'),

('price_high_low', 'fr', 'Prix décroissant'),
('price_high_low', 'en', 'Price: High to Low'),
('price_high_low', 'ar', 'السعر: من الأعلى إلى الأقل'),
('price_high_low', 'ar-MA', 'الثمن: من الغالي للرخيص'),

('newest', 'fr', 'Plus récent'),
('newest', 'en', 'Newest'),
('newest', 'ar', 'الأحدث'),
('newest', 'ar-MA', 'الجديد'),

('rating', 'fr', 'Évaluation'),
('rating', 'en', 'Rating'),
('rating', 'ar', 'التقييم'),
('rating', 'ar-MA', 'التقييم'),

('apply_filters', 'fr', 'Appliquer les filtres'),
('apply_filters', 'en', 'Apply filters'),
('apply_filters', 'ar', 'تطبيق المرشحات'),
('apply_filters', 'ar-MA', 'طبق الفلاتر'),

('clear_filters', 'fr', 'Effacer les filtres'),
('clear_filters', 'en', 'Clear filters'),
('clear_filters', 'ar', 'مسح المرشحات'),
('clear_filters', 'ar-MA', 'مسح الفلاتر'),

-- Product related
('add_to_cart', 'fr', 'Ajouter au panier'),
('add_to_cart', 'en', 'Add to cart'),
('add_to_cart', 'ar', 'أضف إلى السلة'),
('add_to_cart', 'ar-MA', 'زيد للسلة'),

('add_to_favorites', 'fr', 'Ajouter aux favoris'),
('add_to_favorites', 'en', 'Add to favorites'),
('add_to_favorites', 'ar', 'أضف إلى المفضلة'),
('add_to_favorites', 'ar-MA', 'زيد للمفضلة'),

('product_details', 'fr', 'Détails du produit'),
('product_details', 'en', 'Product details'),
('product_details', 'ar', 'تفاصيل المنتج'),
('product_details', 'ar-MA', 'تفاصيل المنتوج'),

('description', 'fr', 'Description'),
('description', 'en', 'Description'),
('description', 'ar', 'الوصف'),
('description', 'ar-MA', 'الوصف'),

('specifications', 'fr', 'Spécifications'),
('specifications', 'en', 'Specifications'),
('specifications', 'ar', 'المواصفات'),
('specifications', 'ar-MA', 'المواصفات'),

('material', 'fr', 'Matière'),
('material', 'en', 'Material'),
('material', 'ar', 'المادة'),
('material', 'ar-MA', 'المادة'),

('origin', 'fr', 'Origine'),
('origin', 'en', 'Origin'),
('origin', 'ar', 'المنشأ'),
('origin', 'ar-MA', 'المنشأ'),

('quantity', 'fr', 'Quantité'),
('quantity', 'en', 'Quantity'),
('quantity', 'ar', 'الكمية'),
('quantity', 'ar-MA', 'الكمية'),

('in_stock', 'fr', 'En stock'),
('in_stock', 'en', 'In stock'),
('in_stock', 'ar', 'متوفر'),
('in_stock', 'ar-MA', 'كاين'),

('out_of_stock', 'fr', 'Rupture de stock'),
('out_of_stock', 'en', 'Out of stock'),
('out_of_stock', 'ar', 'غير متوفر'),
('out_of_stock', 'ar-MA', 'ماكاينش'),

('related_products', 'fr', 'Produits similaires'),
('related_products', 'en', 'Related products'),
('related_products', 'ar', 'منتجات مشابهة'),
('related_products', 'ar-MA', 'منتوجات مشابهة'),

-- Cart
('shopping_cart', 'fr', 'Panier d''achat'),
('shopping_cart', 'en', 'Shopping cart'),
('shopping_cart', 'ar', 'سلة التسوق'),
('shopping_cart', 'ar-MA', 'سلة التسوق'),

('cart_empty', 'fr', 'Votre panier est vide'),
('cart_empty', 'en', 'Your cart is empty'),
('cart_empty', 'ar', 'سلتك فارغة'),
('cart_empty', 'ar-MA', 'السلة ديالك خاوية'),

('continue_shopping', 'fr', 'Continuer les achats'),
('continue_shopping', 'en', 'Continue shopping'),
('continue_shopping', 'ar', 'تابع التسوق'),
('continue_shopping', 'ar-MA', 'كمل التسوق'),

('checkout', 'fr', 'Finaliser la commande'),
('checkout', 'en', 'Checkout'),
('checkout', 'ar', 'إتمام الطلب'),
('checkout', 'ar-MA', 'كمل الطلب'),

('total', 'fr', 'Total'),
('total', 'en', 'Total'),
('total', 'ar', 'المجموع'),
('total', 'ar-MA', 'المجموع'),

('subtotal', 'fr', 'Sous-total'),
('subtotal', 'en', 'Subtotal'),
('subtotal', 'ar', 'المجموع الفرعي'),
('subtotal', 'ar-MA', 'المجموع الفرعي'),

('shipping', 'fr', 'Livraison'),
('shipping', 'en', 'Shipping'),
('shipping', 'ar', 'الشحن'),
('shipping', 'ar-MA', 'التوصيل'),

('remove', 'fr', 'Supprimer'),
('remove', 'en', 'Remove'),
('remove', 'ar', 'إزالة'),
('remove', 'ar-MA', 'حيد'),

-- Authentication
('email', 'fr', 'Email'),
('email', 'en', 'Email'),
('email', 'ar', 'البريد الإلكتروني'),
('email', 'ar-MA', 'الإيميل'),

('password', 'fr', 'Mot de passe'),
('password', 'en', 'Password'),
('password', 'ar', 'كلمة المرور'),
('password', 'ar-MA', 'الباسوورد'),

('confirm_password', 'fr', 'Confirmer le mot de passe'),
('confirm_password', 'en', 'Confirm password'),
('confirm_password', 'ar', 'تأكيد كلمة المرور'),
('confirm_password', 'ar-MA', 'أكد الباسوورد'),

('first_name', 'fr', 'Prénom'),
('first_name', 'en', 'First name'),
('first_name', 'ar', 'الاسم الأول'),
('first_name', 'ar-MA', 'الاسم الأول'),

('last_name', 'fr', 'Nom'),
('last_name', 'en', 'Last name'),
('last_name', 'ar', 'اسم العائلة'),
('last_name', 'ar-MA', 'اسم العائلة'),

('forgot_password', 'fr', 'Mot de passe oublié ?'),
('forgot_password', 'en', 'Forgot password?'),
('forgot_password', 'ar', 'نسيت كلمة المرور؟'),
('forgot_password', 'ar-MA', 'نسيتي الباسوورد؟'),

('create_account', 'fr', 'Créer un compte'),
('create_account', 'en', 'Create account'),
('create_account', 'ar', 'إنشاء حساب'),
('create_account', 'ar-MA', 'دير حساب'),

('already_have_account', 'fr', 'Vous avez déjà un compte ?'),
('already_have_account', 'en', 'Already have an account?'),
('already_have_account', 'ar', 'لديك حساب بالفعل؟'),
('already_have_account', 'ar-MA', 'عندك حساب ديجا؟'),

('dont_have_account', 'fr', 'Vous n''avez pas de compte ?'),
('dont_have_account', 'en', 'Don''t have an account?'),
('dont_have_account', 'ar', 'ليس لديك حساب؟'),
('dont_have_account', 'ar-MA', 'ماعندكش حساب؟'),

('logout', 'fr', 'Déconnexion'),
('logout', 'en', 'Logout'),
('logout', 'ar', 'تسجيل الخروج'),
('logout', 'ar-MA', 'خروج'),

-- Footer
('follow_us', 'fr', 'Suivez-nous'),
('follow_us', 'en', 'Follow us'),
('follow_us', 'ar', 'تابعونا'),
('follow_us', 'ar-MA', 'تابعونا'),

('newsletter', 'fr', 'Newsletter'),
('newsletter', 'en', 'Newsletter'),
('newsletter', 'ar', 'النشرة الإخبارية'),
('newsletter', 'ar-MA', 'النيوزليتر'),

('subscribe', 'fr', 'S''abonner'),
('subscribe', 'en', 'Subscribe'),
('subscribe', 'ar', 'اشترك'),
('subscribe', 'ar-MA', 'اشترك'),

('quick_links', 'fr', 'Liens rapides'),
('quick_links', 'en', 'Quick links'),
('quick_links', 'ar', 'روابط سريعة'),
('quick_links', 'ar-MA', 'روابط سريعة'),

('customer_service', 'fr', 'Service client'),
('customer_service', 'en', 'Customer service'),
('customer_service', 'ar', 'خدمة العملاء'),
('customer_service', 'ar-MA', 'خدمة العملاء'),

('terms_conditions', 'fr', 'Conditions d''utilisation'),
('terms_conditions', 'en', 'Terms & Conditions'),
('terms_conditions', 'ar', 'الشروط والأحكام'),
('terms_conditions', 'ar-MA', 'الشروط والأحكام'),

('privacy_policy', 'fr', 'Politique de confidentialité'),
('privacy_policy', 'en', 'Privacy Policy'),
('privacy_policy', 'ar', 'سياسة الخصوصية'),
('privacy_policy', 'ar-MA', 'سياسة الخصوصية'),

('shipping_info', 'fr', 'Informations de livraison'),
('shipping_info', 'en', 'Shipping info'),
('shipping_info', 'ar', 'معلومات الشحن'),
('shipping_info', 'ar-MA', 'معلومات التوصيل'),

('returns', 'fr', 'Retours'),
('returns', 'en', 'Returns'),
('returns', 'ar', 'المرتجعات'),
('returns', 'ar-MA', 'المرتجعات'),

('faq', 'fr', 'FAQ'),
('faq', 'en', 'FAQ'),
('faq', 'ar', 'الأسئلة الشائعة'),
('faq', 'ar-MA', 'الأسئلة الشائعة'),

('copyright', 'fr', 'Tous droits réservés'),
('copyright', 'en', 'All rights reserved'),
('copyright', 'ar', 'جميع الحقوق محفوظة'),
('copyright', 'ar-MA', 'جميع الحقوق محفوظة'),

-- Contact page
('contact_us', 'fr', 'Contactez-nous'),
('contact_us', 'en', 'Contact us'),
('contact_us', 'ar', 'اتصل بنا'),
('contact_us', 'ar-MA', 'اتصل بنا'),

('get_in_touch', 'fr', 'Prenez contact avec nous'),
('get_in_touch', 'en', 'Get in touch with us'),
('get_in_touch', 'ar', 'تواصل معنا'),
('get_in_touch', 'ar-MA', 'تواصل معنا'),

('name', 'fr', 'Nom'),
('name', 'en', 'Name'),
('name', 'ar', 'الاسم'),
('name', 'ar-MA', 'الاسم'),

('subject', 'fr', 'Sujet'),
('subject', 'en', 'Subject'),
('subject', 'ar', 'الموضوع'),
('subject', 'ar-MA', 'الموضوع'),

('message', 'fr', 'Message'),
('message', 'en', 'Message'),
('message', 'ar', 'الرسالة'),
('message', 'ar-MA', 'الرسالة'),

('send_message', 'fr', 'Envoyer le message'),
('send_message', 'en', 'Send message'),
('send_message', 'ar', 'إرسال الرسالة'),
('send_message', 'ar-MA', 'صيفط الرسالة'),

('phone', 'fr', 'Téléphone'),
('phone', 'en', 'Phone'),
('phone', 'ar', 'الهاتف'),
('phone', 'ar-MA', 'التيليفون'),

('address', 'fr', 'Adresse'),
('address', 'en', 'Address'),
('address', 'ar', 'العنوان'),
('address', 'ar-MA', 'العنوان'),

('office_hours', 'fr', 'Heures d''ouverture'),
('office_hours', 'en', 'Office hours'),
('office_hours', 'ar', 'ساعات العمل'),
('office_hours', 'ar-MA', 'ساعات الشغل'),

-- About page
('about_us', 'fr', 'À propos de nous'),
('about_us', 'en', 'About us'),
('about_us', 'ar', 'من نحن'),
('about_us', 'ar-MA', 'علينا'),

('our_story', 'fr', 'Notre histoire'),
('our_story', 'en', 'Our story'),
('our_story', 'ar', 'قصتنا'),
('our_story', 'ar-MA', 'القصة ديالنا'),

('our_mission', 'fr', 'Notre mission'),
('our_mission', 'en', 'Our mission'),
('our_mission', 'ar', 'مهمتنا'),
('our_mission', 'ar-MA', 'المهمة ديالنا'),

('our_values', 'fr', 'Nos valeurs'),
('our_values', 'en', 'Our values'),
('our_values', 'ar', 'قيمنا'),
('our_values', 'ar-MA', 'القيم ديالنا'),

('our_team', 'fr', 'Notre équipe'),
('our_team', 'en', 'Our team'),
('our_team', 'ar', 'فريقنا'),
('our_team', 'ar-MA', 'الفريق ديالنا'),

-- Common actions
('learn_more', 'fr', 'En savoir plus'),
('learn_more', 'en', 'Learn more'),
('learn_more', 'ar', 'اعرف أكثر'),
('learn_more', 'ar-MA', 'عرف كتر'),

('read_more', 'fr', 'Lire la suite'),
('read_more', 'en', 'Read more'),
('read_more', 'ar', 'اقرأ المزيد'),
('read_more', 'ar-MA', 'قرا كتر'),

('show_more', 'fr', 'Afficher plus'),
('show_more', 'en', 'Show more'),
('show_more', 'ar', 'إظهار المزيد'),
('show_more', 'ar-MA', 'ورّي كتر'),

('show_less', 'fr', 'Afficher moins'),
('show_less', 'en', 'Show less'),
('show_less', 'ar', 'إظهار أقل'),
('show_less', 'ar-MA', 'ورّي أقل'),

('save', 'fr', 'Enregistrer'),
('save', 'en', 'Save'),
('save', 'ar', 'حفظ'),
('save', 'ar-MA', 'حفظ'),

('cancel', 'fr', 'Annuler'),
('cancel', 'en', 'Cancel'),
('cancel', 'ar', 'إلغاء'),
('cancel', 'ar-MA', 'إلغاء'),

('edit', 'fr', 'Modifier'),
('edit', 'en', 'Edit'),
('edit', 'ar', 'تعديل'),
('edit', 'ar-MA', 'بدل'),

('delete', 'fr', 'Supprimer'),
('delete', 'en', 'Delete'),
('delete', 'ar', 'حذف'),
('delete', 'ar-MA', 'حيد'),

('confirm', 'fr', 'Confirmer'),
('confirm', 'en', 'Confirm'),
('confirm', 'ar', 'تأكيد'),
('confirm', 'ar-MA', 'أكد'),

('close', 'fr', 'Fermer'),
('close', 'en', 'Close'),
('close', 'ar', 'إغلاق'),
('close', 'ar-MA', 'سد'),

-- Status messages
('loading', 'fr', 'Chargement...'),
('loading', 'en', 'Loading...'),
('loading', 'ar', 'جاري التحميل...'),
('loading', 'ar-MA', 'كايحمل...'),

('error', 'fr', 'Erreur'),
('error', 'en', 'Error'),
('error', 'ar', 'خطأ'),
('error', 'ar-MA', 'خطأ'),

('success', 'fr', 'Succès'),
('success', 'en', 'Success'),
('success', 'ar', 'نجح'),
('success', 'ar-MA', 'نجح'),

('warning', 'fr', 'Attention'),
('warning', 'en', 'Warning'),
('warning', 'ar', 'تحذير'),
('warning', 'ar-MA', 'انتباه'),

('no_results', 'fr', 'Aucun résultat trouvé'),
('no_results', 'en', 'No results found'),
('no_results', 'ar', 'لم يتم العثور على نتائج'),
('no_results', 'ar-MA', 'ماتلقاوش نتائج'),

('page_not_found', 'fr', 'Page non trouvée'),
('page_not_found', 'en', 'Page not found'),
('page_not_found', 'ar', 'الصفحة غير موجودة'),
('page_not_found', 'ar-MA', 'الصفحة ماكايناش')

ON CONFLICT (key, locale) DO UPDATE SET 
value = EXCLUDED.value,
updated_at = now();