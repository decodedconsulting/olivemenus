$(document).ready(function(){
    
	$('.os-accordion').accordion({
		heightStyle: "content",
		collapsible: true,
		active: false
	});
    
	$('.os-tabs').tabs();
	
	$('.search').filterList();
	
	
	var menuList = $('ol#menu-list'),
		menuListConfig = {
			handle: 'div',
			items: 'li',
			toleranceElement: '> div',
			isTree: true,
			forcePlaceholderSize: true,
			placeholder: 'placeholder'
			/*,
			relocate: function(event, ui){
				console.log($(ui.item).parent().parent().attr('id'));
			}
			*/
		};
		
	menuList.nestedSortable(menuListConfig);
	
    var deletedMenuItems = $('#menu-items-deleted');
    
    menuList.on('click', '.delete-menu', function(){
        if ( confirm('Are you sure you want to delete this menu item?') )
        {
            var element = $(this),
                targetToDeleteID = element.attr('data-id'),
                targetToDelete = $('#menu-item-' + targetToDeleteID);
                targetChildren = targetToDelete.find('ol');
                deletedMenuItemsValue = deletedMenuItems.val();
                
            if ( deletedMenuItemsValue == '' ) deletedMenuItemsValue = [];
            else deletedMenuItemsValue = deletedMenuItemsValue.split(',')
                
            deletedMenuItemsValue.push(targetToDeleteID);
            deletedMenuItems.val(deletedMenuItemsValue.toString());
            
            if ( targetChildren.length )  
            {
                var childrenHTML = targetChildren.html();
                targetChildren.remove();
                targetToDelete.before($(childrenHTML));
            }
			
            targetToDelete.remove();
			
			if ( menuList.find('li').length == 0 ) $('#menu-list-placeholder').show();
        }
    });
    
    menuList.on('click', '.settings-toggle', function(){
        if ( !$(this).hasClass('ui-sortable-helper') ) $(this).closest('li').toggleClass('active');
    });
    
	var inputCounter;
	if ( $('#menu-list li').length == 0 ) inputCounter = 1;
	else 
	{
		var biggestID = 0;
		$('#menu-list li').each(function(){
			var elementID = $(this).attr('id'),
				elementIDNumber = parseInt(elementID.replace('menu-item-', '')); 
			
			if ( elementIDNumber > biggestID ) biggestID = elementIDNumber;
		});
		
		inputCounter = biggestID + 1;
	}
	
	$('#menu-items-sidebar form').each(function(){
		var form = $(this);
		
		form.submit(function(e) {
			
			e.preventDefault();			
			
			$('#menu-list-placeholder').hide();
			
			var inputs = form.find('input[type="checkbox"]'),
				values = [];
			
			inputs.each(function(){
				var input = $(this);
				
				if ( input.is(':checked') )
				{
					var itemID = input.val(),
						itemURL = input.attr('data-url'),
						itemName = input.next().text(),
						itemHTML = '';
						
					itemHTML += '<li id="menu-item-' + inputCounter + '" class="mjs-nestedSortable-leaf">';
						itemHTML += '<div class="ui-sortable-handle">';
							itemHTML += '<div class="item-heading">';
                                itemHTML += '<span class="settings-toggle"></span>';
                                itemHTML += '<span class="menu-title">' + itemName + '</span>';
                                itemHTML += '<span class="delete-menu btn small" data-id="' + inputCounter + '">Delete</span>';
                            itemHTML += '</div>';
							itemHTML += '<div class="item-content">';
								itemHTML += '<input type="hidden" name="item-entry-id" value="' + itemID + '">';                            
                                itemHTML += '<div class="inner">';
                                    itemHTML += '<div class="row field">';
                                        itemHTML += '<div class="heading">';
                                            itemHTML += '<label>Name:</label>';
                                        itemHTML += '</div>';
                                        itemHTML += '<div class="input">';
                                            itemHTML += '<input class="text nicetext fullwidth" type="text" name="item-name" value="' + itemName + '">';                                    
                                        itemHTML += '</div>';
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';	
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Class:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<input class="text nicetext fullwidth" type="text" name="class" value="" />';
										itemHTML += '</div>';
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';											
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Class parent:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<input class="text nicetext fullwidth" type="text" name="class-parent" value="" />';
										itemHTML += '</div>';
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';											
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Data JSON:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<textarea class="text nicetext fullwidth" name="data-json"></textarea>';
										itemHTML += '</div>';											
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';	
                                        itemHTML += '<div class="heading">';
                                            if ( itemURL ) itemHTML += '<label>Original:</label> <a href="' + itemURL + '" target="_blank">' + itemName + '</a>';
                                        itemHTML += '</div>';
                                    itemHTML += '</div>';
                                itemHTML += '</div>';
							itemHTML += '</div>';
						itemHTML += '</div>';
					itemHTML += '</li>';
					
					inputCounter++;					
					menuList.append(itemHTML);
					
				}
			});
			
			//reset checkes
			inputs.prop('checked', false); 	
            
            if ( form.hasClass('custom-url') )
            {
                var customMenuTitle = $('#custom-menu-title'),
                    customMenuTitleVal = customMenuTitle.val(),
                    customMenuURL = $('#custom-menu-url'),
                    customMenuURLVal = customMenuURL.val(),
                    itemHTML = '';

                customMenuTitle.removeClass('error');
                customMenuURL.removeClass('error');
                
                if ( customMenuTitleVal == '' || customMenuURLVal == '' )
                {
                    if ( customMenuTitleVal == '' ) customMenuTitle.addClass('error');
                    if ( customMenuURLVal == '' ) customMenuURL.addClass('error');
                }
                else
                {                   
					itemHTML += '<li id="menu-item-' + inputCounter + '" class="mjs-nestedSortable-leaf">';
						itemHTML += '<div class="ui-sortable-handle">';
							itemHTML += '<div class="item-heading">';
                                itemHTML += '<span class="settings-toggle"></span>';
                                itemHTML += '<span class="menu-title">' + customMenuTitleVal + '</span>';
                                itemHTML += '<span class="delete-menu btn small" data-id="' + inputCounter + '">Delete</span>';
                            itemHTML += '</div>';
							itemHTML += '<div class="item-content">';
                                itemHTML += '<div class="inner">';
                                    itemHTML += '<div class="row field">';
                                        itemHTML += '<div class="heading">';
                                            itemHTML += '<label>Name:</label>';
                                        itemHTML += '</div>';
                                        itemHTML += '<div class="input">';
                                            itemHTML += '<input class="text nicetext fullwidth" type="text" name="item-name" value="' + customMenuTitleVal + '">';                                    
                                        itemHTML += '</div>';
									itemHTML += '</div>';
                                    itemHTML += '<div class="row field">';
                                        itemHTML += '<div class="heading">';
                                            itemHTML += '<label>Custom URL:</label>';
                                        itemHTML += '</div>';
                                        itemHTML += '<div class="input">';
                                            itemHTML += '<input class="text nicetext fullwidth" type="text" name="custom-url" value="' + customMenuURLVal + '">';
                                        itemHTML += '</div>';
                                    itemHTML += '</div>'; 									
									itemHTML += '<div class="row field">';											
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Class:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<input class="text nicetext fullwidth" type="text" name="class" value="" />';
										itemHTML += '</div>';
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';											
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Class parent:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<input class="text nicetext fullwidth" type="text" name="class-parent" value="" />';
										itemHTML += '</div>';
									itemHTML += '</div>';										
									itemHTML += '<div class="row field">';											
										itemHTML += '<div class="heading">';
											itemHTML += '<label>Data JSON:</label>';
										itemHTML += '</div>';
										itemHTML += '<div class="input">';
											itemHTML += '<textarea class="text nicetext fullwidth" name="data-json"></textarea>';
										itemHTML += '</div>';										
                                    itemHTML += '</div>';                                   
                                itemHTML += '</div>';
							itemHTML += '</div>';
						itemHTML += '</div>';
					itemHTML += '</li>';
                    
					inputCounter++;					
					menuList.append(itemHTML);                    
                }
            }
		
		});
			
	});
	
	
	//main form submit
	var mainForm = $('#menu-items form');
	
	mainForm.submit(function(e) {
		e.preventDefault();		
		
		var menuListProcessed = [],
			menuListToArray = menuList.nestedSortable('toArray', {startDepthCount: 0});
		
		if ( $.isArray(menuListToArray) )
		{		
			for (var index in menuListToArray)
			{
				var menuItem = menuListToArray[index];
				
				console.log(menuItem);
				
				if ( typeof menuItem.id !== 'undefined' )
				{
					
					var menuItemID = menuItem.id,
						menuItemParentID = (typeof menuItem.parent_id !== null ) ? menuItem.parent_id : 0,
						menuItemElement = $('#menu-item-' + menuItemID),
						menuItemNameElement = menuItemElement.find('input[name="item-name"]'),
						menuItemNameValue = menuItemNameElement.val(),
						menuItemEntryIDElement = menuItemElement.find('input[name="item-entry-id"]'),
						menuItemEntryIDValue = menuItemEntryIDElement.val(),
                        menuItemCustomURLElement = menuItemElement.find('input[name="custom-url"]'),
                        menuItemCustomURLValue = menuItemCustomURLElement.val(),
                        menuItemClassElement = menuItemElement.find('input[name="class"]'),
						menuItemClassValue = menuItemClassElement.val(),
                        menuItemClassParentElement = menuItemElement.find('input[name="class-parent"]'),
						menuItemClassParentValue = menuItemClassParentElement.val(),
                        menuItemDataElement = menuItemElement.find('textarea[name="data-json"]'),
						menuItemDataValue = menuItemDataElement.val();						
									
					var menuItemData = {
						'item-id' : menuItemID,
						'parent-id' : menuItemParentID,
						'name' : menuItemNameValue,
						'entry-id' : menuItemEntryIDValue,
                        'custom-url' : menuItemCustomURLValue,
                        'class' : menuItemClassValue,
                        'class-parent' : menuItemClassParentValue,
                        'data-json' : menuItemDataValue
					};
					
					menuListProcessed.push(menuItemData);
				}
			}
			
			$('#menu-items-serialized').val(JSON.stringify(menuListProcessed));
			this.submit();
		}	
		
	});
	
	
	//delete menu from menu items list
	$('#delete-menu-with-items').on('click', function(e){
		e.preventDefault();
		
		
	});
	
});

