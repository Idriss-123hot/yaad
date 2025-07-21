-- Add missing translation keys for artisans and products pages
INSERT INTO public.translations (key, locale, value) VALUES
-- Artisan page translations
('our_artisans', 'fr', 'Nos Artisans'),
('our_artisans', 'en', 'Our Artisans'),
('our_artisans', 'ar', 'حرفيونا'),
('our_artisans', 'ar-MA', 'الصُنَّاع ديالنا'),

('search_artisans_placeholder', 'fr', 'Rechercher des artisans par nom ou localisation...'),
('search_artisans_placeholder', 'en', 'Search artisans by name or location...'),
('search_artisans_placeholder', 'ar', 'البحث عن الحرفيين بالاسم أو الموقع...'),
('search_artisans_placeholder', 'ar-MA', 'قلب على الصُنَّاع بالسمية ولا المكان...'),

('no_artisans_found', 'fr', 'Aucun artisan trouvé'),
('no_artisans_found', 'en', 'No artisans found'),
('no_artisans_found', 'ar', 'لم يتم العثور على حرفيين'),
('no_artisans_found', 'ar-MA', 'ماكاين حتا صانع'),

('no_artisans_search_match', 'fr', 'Aucun artisan ne correspond à votre recherche pour "{searchTerm}".'),
('no_artisans_search_match', 'en', 'No artisans match your search for "{searchTerm}".'),
('no_artisans_search_match', 'ar', 'لا يوجد حرفيون يطابقون بحثك عن "{searchTerm}".'),
('no_artisans_search_match', 'ar-MA', 'ماكاين حتا صانع كيطابق التلابة ديالك "{searchTerm}".'),

('no_artisans_yet', 'fr', 'Nous n''avons pas encore d''artisans à afficher.'),
('no_artisans_yet', 'en', 'We don''t have any artisans to display yet.'),
('no_artisans_yet', 'ar', 'ليس لدينا أي حرفيين لعرضهم حتى الآن.'),
('no_artisans_yet', 'ar-MA', 'مازال ماعندناش حتا صانع نوريوه.'),

-- Artisan detail page translations
('loading_artisan_details', 'fr', 'Chargement des détails de l''artisan...'),
('loading_artisan_details', 'en', 'Loading artisan details...'),
('loading_artisan_details', 'ar', 'جاري تحميل تفاصيل الحرفي...'),
('loading_artisan_details', 'ar-MA', 'كايتحمل تفاصيل الصانع...'),

('artisan_not_found', 'fr', 'Artisan non trouvé'),
('artisan_not_found', 'en', 'Artisan not found'),
('artisan_not_found', 'ar', 'الحرفي غير موجود'),
('artisan_not_found', 'ar-MA', 'الصانع ماكاينش'),

('artisan_not_found_description', 'fr', 'Désolé, l''artisan que vous recherchez n''existe pas.'),
('artisan_not_found_description', 'en', 'Sorry, the artisan you are looking for does not exist.'),
('artisan_not_found_description', 'ar', 'آسف، الحرفي الذي تبحث عنه غير موجود.'),
('artisan_not_found_description', 'ar-MA', 'سماح ليا، الصانع اللي كاتقلب عليه ماكاينش.'),

('view_all_artisans', 'fr', 'Voir tous les artisans'),
('view_all_artisans', 'en', 'View all artisans'),
('view_all_artisans', 'ar', 'عرض جميع الحرفيين'),
('view_all_artisans', 'ar-MA', 'شوف گاع الصُنَّاع'),

('member_since', 'fr', 'Membre depuis'),
('member_since', 'en', 'Member since'),
('member_since', 'ar', 'عضو منذ'),
('member_since', 'ar-MA', 'عضو من'),

('featured_artisan', 'fr', 'Artisan en Vedette'),
('featured_artisan', 'en', 'Featured Artisan'),
('featured_artisan', 'ar', 'حرفي مميز'),
('featured_artisan', 'ar-MA', 'صانع مميز'),

('visit_website', 'fr', 'Visiter le site web'),
('visit_website', 'en', 'Visit website'),
('visit_website', 'ar', 'زيارة الموقع الإلكتروني'),
('visit_website', 'ar-MA', 'زور الموقع'),

('artisan_gallery', 'fr', 'Galerie de l''artisan'),
('artisan_gallery', 'en', 'Artisan Gallery'),
('artisan_gallery', 'ar', 'معرض الحرفي'),
('artisan_gallery', 'ar-MA', 'معرض الصانع'),

('products_by', 'fr', 'Produits par'),
('products_by', 'en', 'Products by'),
('products_by', 'ar', 'منتجات'),
('products_by', 'ar-MA', 'منتوجات'),

('no_products_available', 'fr', 'Aucun produit disponible pour le moment.'),
('no_products_available', 'en', 'No products available at the moment.'),
('no_products_available', 'ar', 'لا توجد منتجات متاحة في الوقت الحالي.'),
('no_products_available', 'ar-MA', 'ماكاين حتا منتوج دابا.'),

('view_other_artisans', 'fr', 'Voir d''autres artisans'),
('view_other_artisans', 'en', 'View other artisans'),
('view_other_artisans', 'ar', 'عرض حرفيين آخرين'),
('view_other_artisans', 'ar-MA', 'شوف صُنَّاع أخرين'),

('about', 'fr', 'À propos de'),
('about', 'en', 'About'),
('about', 'ar', 'حول'),
('about', 'ar-MA', 'على'),

('back', 'fr', 'Retour'),
('back', 'en', 'Back'),
('back', 'ar', 'رجوع'),
('back', 'ar-MA', 'رجع'),

-- Product page translations
('loading_product', 'fr', 'Chargement du produit...'),
('loading_product', 'en', 'Loading product...'),
('loading_product', 'ar', 'جاري تحميل المنتج...'),
('loading_product', 'ar-MA', 'كايتحمل المنتوج...'),

('product_not_found', 'fr', 'Produit non trouvé'),
('product_not_found', 'en', 'Product not found'),
('product_not_found', 'ar', 'المنتج غير موجود'),
('product_not_found', 'ar-MA', 'المنتوج ماكاينش'),

('product_not_found_description', 'fr', 'Nous n''avons pas pu trouver le produit que vous recherchez.'),
('product_not_found_description', 'en', 'We couldn''t find the product you''re looking for.'),
('product_not_found_description', 'ar', 'لم نتمكن من العثور على المنتج الذي تبحث عنه.'),
('product_not_found_description', 'ar-MA', 'ماقدرناش نلقاو المنتوج اللي كاتقلب عليه.'),

('browse_all_products', 'fr', 'Parcourir tous les produits'),
('browse_all_products', 'en', 'Browse all products'),
('browse_all_products', 'ar', 'تصفح جميع المنتجات'),
('browse_all_products', 'ar-MA', 'شوف گاع المنتوجات'),

('reviews', 'fr', 'avis'),
('reviews', 'en', 'reviews'),
('reviews', 'ar', 'مراجعات'),
('reviews', 'ar-MA', 'تقييمات')

-- Handle conflicts
ON CONFLICT (key, locale) DO UPDATE SET 
value = EXCLUDED.value,
updated_at = now();